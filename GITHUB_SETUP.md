# 📱 GitHub + Expo Go Setup (iPhone Edition)

## 🎯 Goal
Push this Expo app to GitHub and open it on your iPhone via Expo Go with a shareable link.

---

## Step 1: Create GitHub Repository

### 1a. Create Account (if needed)
- Go to https://github.com and sign up (free)

### 1b. Create New Repository
1. Click **+** icon (top-right) → **New repository**
2. **Repository name:** `alarm-notifications-app`
3. **Description:** Modern alarm notification UI for Expo Go
4. **Public** (so you can share the link)
5. **Add .gitignore:** Select "Node"
6. Click **Create repository**

---

## Step 2: Push Code to GitHub

### On Your Mac/Computer Terminal:

```bash
# Navigate to your project folder
cd /path/to/alarm-notifications-app

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Alarm notification app for Expo Go"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/alarm-notifications-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Step 3: Generate Expo Go Link

### Option A: Direct GitHub Deployment (Recommended)

1. On your computer, in the project folder:
```bash
npm install
npx expo start --web
```

2. Expo will give you a URL. Save it.

3. Generate a **Expo Go** link:
```bash
npx expo publish
```
(This creates a cloud-hosted version)

4. You'll get a shareable link like:
```
exp://exp.host/@your-username/alarm-notifications-app
```

### Option B: Quick Local Testing First

```bash
# Terminal on Mac
npx expo start

# This shows a QR code - scan with iPhone camera or Expo Go app
# Then open in Expo Go
```

---

## Step 4: Open on iPhone

### Method 1: Scan QR Code (Easiest)
1. Open Terminal after running `npx expo start`
2. Point iPhone camera at QR code
3. Tap "Open in Expo Go"
4. **Done!** ✅

### Method 2: Use Expo Go App + Share Link
1. Copy the `exp://exp.host/...` link from terminal
2. On iPhone, open **Notes** or **Messages**
3. Paste the link
4. Tap the link → "Open in Expo Go"
5. **Done!** ✅

### Method 3: GitHub + Expo Snack (Web)
1. Go to https://snack.expo.dev
2. Import from GitHub (at Snack.expo.dev)
3. Works in web browser preview
4. Less ideal for iPhone testing, but accessible

---

## Step 5: Share with Others

### Share Your Expo Link
Once you have your `exp://...` link, you can:

- **Email** the link to others
- **Text/iMessage** the link
- **Post on Twitter** (mentions @expo_dev)
- **Share in Discord** or Slack

Anyone with **Expo Go** installed can open it instantly!

---

## Step 6: Update Code & Redeploy

### Every time you make changes:

```bash
# Stage changes
git add .

# Commit
git commit -m "Update: [describe your change]"

# Push to GitHub
git push origin main

# (If you published with expo publish)
# Republish to update the link
npx expo publish
```

Your iPhone will auto-update the next time you open the Expo Go link!

---

## 🔗 Useful Links

| Link | Purpose |
|------|---------|
| https://github.com/new | Create repository |
| https://expo.dev | Expo official site |
| https://snack.expo.dev | Test code online |
| https://icons.expo.fyi | Find icon names |
| https://docs.expo.dev | Full documentation |

---

## Troubleshooting

### "Can't connect to Expo servers"
- Make sure iPhone and Mac are on **same WiFi**
- Run `npx expo start` again
- Try `npx expo start --tunnel` for internet connection

### QR code won't scan
- Make sure iPhone camera/Expo Go has permission
- Try tapping "Tunnel" in terminal and use the generated link

### Changes don't appear on iPhone
- Hard refresh in Expo Go (shake phone → Reload)
- Or close and reopen the app

### Git command "not found"
- Install Git: `brew install git` (Mac)
- Or download from https://git-scm.com

### Lost your Expo link?
Run this again:
```bash
npx expo start
```
It generates a new QR code each time!

---

## Advanced: Deploy to Expo Hosting

Want a permanent hosted URL?

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure
eas build --platform ios --profile preview

# Share the generated link!
```

This creates a permanent expo.dev link you can share forever.

---

## Your Repo README Template

Copy this into your GitHub `README.md`:

```markdown
# Alarm Notifications App

Modern glassmorphic alarm notification UI for Expo Go (iPhone & Android).

## 📱 Try It Now

### Method 1: Quick Scan (Recommended)
```bash
npx expo start
```
Scan QR code with iPhone camera or open in **Expo Go** app

### Method 2: Use Direct Link
```
exp://exp.host/@[your-username]/alarm-notifications-app
```

## Features
- ✨ Glassmorphic design
- 🎯 Interactive snooze (5m, 10m, 15m)
- 📱 Smooth animations
- 🎨 Fully customizable

## Installation
```bash
git clone https://github.com/YOUR_USERNAME/alarm-notifications-app.git
cd alarm-notifications-app
npm install
npx expo start
```

## Tech Stack
- React Native
- Expo
- Linear Gradient animations

## License
MIT
```

---

## You're Done! 🎉

Your app is now:
✅ On GitHub (version control)
✅ Accessible on iPhone (Expo Go)
✅ Shareable with a link
✅ Easy to update

**Next time you want to work on it:**
```bash
git clone https://github.com/YOUR_USERNAME/alarm-notifications-app.git
cd alarm-notifications-app
npm install
npx expo start
```

Happy coding! 🚀
