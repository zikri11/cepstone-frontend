FROM python:3.12-slim-bookworm

# Install Node.js 20 LTS and ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Node dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application files
COPY . .

# Ensure storage directories exist
RUN mkdir -p uploads outputs data

ENV PORT=5000
ENV NODE_ENV=production
ENV PYTHON_PATH=python3

EXPOSE 5000

CMD ["node", "index.js"]
