#!/bin/bash
echo ""
echo "============================================"
echo "  BIS Smart Portal - One-Click Setup"
echo "  Hackathon 2026"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Install it from https://nodejs.org or run:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

echo "[OK] Node.js found: $(node -v)"
echo "[OK] npm found: v$(npm -v)"
echo ""

# Install dependencies
echo "[1/3] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed!"
    exit 1
fi
echo ""
echo "[OK] Dependencies installed!"
echo ""

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
    echo "[2/3] Creating .env.local file..."
    read -p "Enter your Gemini API Key (get one at https://aistudio.google.com/apikey): " API_KEY
    cat > .env.local << EOF
GEMINI_API_KEY=$API_KEY
JWT_SECRET=bis-portal-secret-key-2026
EOF
    echo "[OK] .env.local created!"
else
    echo "[2/3] .env.local already exists - skipping"
fi
echo ""

# Start the server
echo "[3/3] Starting BIS Smart Portal..."
echo ""
echo "============================================"
echo "  Server starting at http://localhost:3000"
echo "  Press Ctrl+C to stop"
echo "============================================"
echo ""
npm run dev
