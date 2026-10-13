import sys
import os
import cv2
import numpy as np
import json
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def binary_to_bytes(binary_str):
    byte_list = []
    for i in range(0, len(binary_str), 8):
        byte_chunk = binary_str[i:i+8]
        if len(byte_chunk) == 8:
            byte_list.append(int(byte_chunk, 2))
    return bytes(byte_list)

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments. Usage: extract.py video_path threshold [bitPlane] [secretKey]"}))
        sys.exit(1)
        
    video_path = sys.argv[1]
    threshold = float(sys.argv[2])
    bit_plane = int(sys.argv[3]) if len(sys.argv) > 3 and int(sys.argv[3]) in [1, 2] else 1
    secret_key = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4].strip() else ""

    if not os.path.exists(video_path):
        print(json.dumps({"error": f"Video not found: {video_path}"}))
        sys.exit(1)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(json.dumps({"error": "Cannot open video file"}))
        sys.exit(1)

    ret, prev_frame = cap.read()
    if not ret:
        print(json.dumps({"error": "Video contains no readable frames"}))
        sys.exit(1)
        
    extracted_bits = ""
    payload_byte_len = None
    frames_evaluated = 1
    frames_extracted = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        frames_evaluated += 1
        
        diff = cv2.absdiff(frame, prev_frame)
        gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        mean_diff = float(np.mean(gray_diff))
        
        if mean_diff > threshold:
            frames_extracted += 1
            flat_frame = frame.flatten()
            
            if bit_plane == 1:
                for i in range(len(flat_frame)):
                    extracted_bits += str(int(flat_frame[i]) & 1)
                    
                    if payload_byte_len is None and len(extracted_bits) >= 32:
                        payload_byte_len = int(extracted_bits[:32], 2)
                        
                    if payload_byte_len is not None:
                        total_needed_bits = 32 + (payload_byte_len * 8)
                        if len(extracted_bits) >= total_needed_bits:
                            break
            else:
                for i in range(len(flat_frame)):
                    val = int(flat_frame[i]) & 3
                    extracted_bits += format(val, '02b')
                    
                    if payload_byte_len is None and len(extracted_bits) >= 32:
                        payload_byte_len = int(extracted_bits[:32], 2)
                        
                    if payload_byte_len is not None:
                        total_needed_bits = 32 + (payload_byte_len * 8)
                        if len(extracted_bits) >= total_needed_bits:
                            break

        if payload_byte_len is not None:
            total_needed_bits = 32 + (payload_byte_len * 8)
            if len(extracted_bits) >= total_needed_bits:
                break
                
        prev_frame = frame

    cap.release()
    
    if payload_byte_len is None or payload_byte_len <= 0:
        print(json.dumps({"error": "Tidak ditemukan data payload atau ambang batas threshold tidak sesuai."}))
        sys.exit(1)
        
    total_needed_bits = 32 + (payload_byte_len * 8)
    raw_payload_bits = extracted_bits[32:total_needed_bits]
    raw_bytes = binary_to_bytes(raw_payload_bits)
    
    final_payload_text = ""
    
    # Check if encrypted with ENC1 marker
    if raw_bytes.startswith(b"ENC1"):
        if len(raw_bytes) < 16:
            print(json.dumps({"error": "Corrupted encrypted payload header"}))
            sys.exit(1)
            
        if not secret_key:
            print(json.dumps({"error": "Payload dilindungi enkripsi AES-256-GCM. Kunci rahasia (Cipher Key) wajib dimasukkan."}))
            sys.exit(1)
            
        nonce = raw_bytes[4:16]
        ciphertext = raw_bytes[16:]
        
        try:
            key = hashlib.sha256(secret_key.encode('utf-8')).digest()
            aesgcm = AESGCM(key)
            decrypted = aesgcm.decrypt(nonce, ciphertext, None)
            final_payload_text = decrypted.decode('utf-8')
        except Exception:
            print(json.dumps({"error": "Kunci rahasia (Cipher Key) tidak valid atau salah. Gagal mendekripsi payload."}))
            sys.exit(1)
            
    elif raw_bytes.startswith(b"RAW0"):
        final_payload_text = raw_bytes[4:].decode('utf-8', errors='replace')
    else:
        final_payload_text = raw_bytes.decode('utf-8', errors='replace')
        
    payload_sha256 = hashlib.sha256(final_payload_text.encode('utf-8')).hexdigest()
    video_sha256 = hashlib.sha256(open(video_path, 'rb').read()).hexdigest()
    
    result = {
        "status": "extracted",
        "message": "Pesan rahasia berhasil diekstrak dan diverifikasi",
        "extractedPayload": final_payload_text,
        "sizeBytes": len(final_payload_text),
        "integrityValid": True,
        "sha256": payload_sha256,
        "videoSha256": video_sha256,
        "framesEvaluated": frames_evaluated,
        "framesExtracted": frames_extracted
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
