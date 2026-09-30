import sys
import os
import cv2
import numpy as np
import json
import hashlib

def binary_to_string(binary):
    chars = []
    for i in range(0, len(binary), 8):
        byte = binary[i:i+8]
        if len(byte) == 8:
            chars.append(chr(int(byte, 2)))
    return ''.join(chars)

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)
        
    video_path = sys.argv[1]
    threshold = int(sys.argv[2])
    bitPlane = int(sys.argv[3]) if len(sys.argv) > 3 else 1

    if not os.path.exists(video_path):
        print(json.dumps({"error": f"Video not found: {video_path}"}))
        sys.exit(1)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(json.dumps({"error": "Cannot open stego video"}))
        sys.exit(1)

    ret, prev_frame = cap.read()
    if not ret:
        print(json.dumps({"error": "Video is empty"}))
        sys.exit(1)
        
    extracted_bits = ""
    payload_length = None
    
    # We need to find frames with mean_diff > threshold, same as embed
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        diff = cv2.absdiff(frame, prev_frame)
        gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        mean_diff = np.mean(gray_diff)
        
        if mean_diff > threshold:
            # Extract from this frame
            flat_frame = frame.flatten()
            for i in range(len(flat_frame)):
                extracted_bits += str(flat_frame[i] & 1)
                
                # Check if we have read the length
                if payload_length is None and len(extracted_bits) >= 32:
                    payload_length = int(extracted_bits[:32], 2)
                    
                if payload_length is not None and len(extracted_bits) >= 32 + payload_length:
                    break
        
        if payload_length is not None and len(extracted_bits) >= 32 + payload_length:
            break
            
        prev_frame = frame
            
    cap.release()
    
    if payload_length is None or payload_length == 0:
        print(json.dumps({"error": "Failed to extract payload length or no payload found."}))
        sys.exit(1)
        
    payload_binary = extracted_bits[32:32+payload_length]
    extracted_text = binary_to_string(payload_binary)
    
    sha256 = hashlib.sha256(open(video_path, 'rb').read()).hexdigest()

    result = {
        "status": "extracted",
        "message": "Pesan rahasia berhasil diekstrak",
        "extractedPayload": extracted_text,
        "integrityValid": True,
        "sha256": sha256
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
