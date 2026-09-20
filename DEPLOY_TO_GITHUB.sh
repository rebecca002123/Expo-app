#!/bin/bash

# This script will push your app to GitHub automatically
# Just run: bash DEPLOY_TO_GITHUB.sh

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     Pushing Alarm App to GitHub (Automated Setup)       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    # For Mac
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install gh
    fi
fi

echo "🔐 Logging into GitHub..."
gh auth login

echo ""
echo "📝 Creating repository..."
gh repo create alarm-notifications-app --public --source=. --remote=origin --push

echo ""
echo "✅ Done! Your repo is at:"
echo "   https://github.com/$(gh api user -q .login)/alarm-notifications-app"
echo ""
echo "📱 To run on iPhone:"
echo "   1. npm install"
echo "   2. npx expo start"
echo "   3. Scan QR code with iPhone camera"
echo "   4. Open in Expo Go app"
echo ""
echo "🎉 You're all set!"
