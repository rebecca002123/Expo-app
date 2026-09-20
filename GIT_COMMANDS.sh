#!/bin/bash

# Alarm Notifications App - Git & GitHub Commands
# Copy and paste these commands one at a time in your terminal

echo "Step 1: Create repo at https://github.com/new"
echo "  - Name it: alarm-notifications-app"
echo "  - Make it PUBLIC"
echo "  - Create repository"
echo ""
echo "Then come back and run these commands:"
echo ""

echo "Step 2: Initialize Git locally"
git init

echo "Step 3: Add all files"
git add .

echo "Step 4: Create first commit"
git commit -m "Initial commit: Alarm notification app for Expo Go"

echo "Step 5: Add remote (REPLACE YOUR_USERNAME with your GitHub username)"
echo "git remote add origin https://github.com/YOUR_USERNAME/alarm-notifications-app.git"

echo "Step 6: Rename branch to main and push"
git branch -M main
echo "git push -u origin main"

echo ""
echo "✅ Done! Your code is on GitHub"
echo ""
echo "Next, to run on your iPhone:"
echo "  1. npm install"
echo "  2. npx expo start"
echo "  3. Scan QR code with iPhone camera"
echo "  4. Open in Expo Go app"
echo ""
echo "To get a shareable link:"
echo "  npx expo start"
echo "  (Look for the exp:// link in terminal)"
