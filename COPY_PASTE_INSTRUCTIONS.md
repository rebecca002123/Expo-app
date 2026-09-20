# 📋 Copy-Paste GitHub Setup for iPhone (No Git Knowledge Needed!)

## 🎯 What You'll End Up With

A shareable link like: `exp://exp.host/@yourname/alarm-notifications-app`

Anyone with Expo Go can tap it and see your app running on their iPhone instantly!

---

## ⏱️ Takes ~10 minutes

---

## Step 1: Create GitHub Repository

1. Open browser: https://github.com/new

2. Fill in:
   - **Repository name:** `alarm-notifications-app`
   - **Description:** Modern alarm notification UI for Expo Go (optional)
   - **Public** ← Select this!
   - ✅ Add .gitignore (Node.js)

3. Click **"Create repository"**

4. **COPY this URL that appears** (looks like):
   ```
   https://github.com/YOUR_USERNAME/alarm-notifications-app.git
   ```

---

## Step 2: Upload Code to GitHub

Open **Terminal** on your Mac and paste these commands ONE AT A TIME:

### Command 1 - Navigate to project folder
```bash
cd /path/to/alarm-notifications-app
```
*(Replace with your actual path - you can drag folder into terminal)*

### Command 2 - Initialize Git
```bash
git init
```

### Command 3 - Add all files
```bash
git add .
```

### Command 4 - Create commit
```bash
git commit -m "Initial commit: Alarm notification app"
```

### Command 5 - Add your GitHub repo URL
```bash
git remote add origin https://github.com/YOUR_USERNAME/alarm-notifications-app.git
```
*(Paste YOUR URL from Step 1)*

### Command 6 - Push to GitHub
```bash
git branch -M main
git push -u origin main
```

It might ask for your GitHub username/password (use a Personal Access Token if needed).

✅ **Done! Code is now on GitHub**

---

## Step 3: Generate Expo Go Link

Still in Terminal, paste:

```bash
npm install
```

Then:

```bash
npx expo start
```

**You'll see output like:**
```
Tunnel ready.
exp://exp.host/@yourname/alarm-notifications-app
```

### 📱 Two ways to test on iPhone:

#### Option A: Scan QR Code (Easiest)
1. Point iPhone camera at the QR code in Terminal
2. Tap "Open in Expo Go" notification
3. **Done!** ✅

#### Option B: Use the exp:// Link
1. Copy the `exp://exp.host/...` link
2. Open Notes on iPhone
3. Paste the link
4. Tap it
5. **Done!** ✅

---

## Step 4: Share Your App!

### Share the exp:// Link

Copy this URL and share:
```
exp://exp.host/@yourname/alarm-notifications-app
```

Friends can:
- Text it to them
- Post on Twitter/Reddit
- Email it
- Share in Discord

Anyone with **Expo Go** installed can tap and see your app! 🎉

---

## 🔄 Update Your App

Every time you make changes:

### In Terminal:
```bash
git add .
git commit -m "Update: [describe what you changed]"
git push origin main
```

Then run again:
```bash
npx expo start
```

Your changes appear in Expo Go automatically! 🔄

---

## 🎨 Quick Customizations (Without Terminal)

Open `AlarmNotificationApp.jsx` in any text editor:

### Change alarm time:
Find: `time: '11:03'`
Change to: `time: '07:30'` or any time

### Change colors:
Find: `color: ['#1e3a8a', '#0c4a6e']`
Change to: `color: ['#7c3aed', '#6d28d9']` (purple)

More colors:
- Red: `['#dc2626', '#b91c1c']`
- Green: `['#059669', '#047857']`
- Orange: `['#f97316', '#ea580c']`

### Change icon:
Find: `icon: 'alarm'`
Change to any from: https://icons.expo.fyi/

Examples: `'coffee'`, `'dumbbell'`, `'bell'`, `'moon'`, `'sun'`

### Save changes:
```bash
git add .
git commit -m "Update: Changed colors"
git push origin main
npx expo start  # Test locally first
```

---

## ❓ Troubleshooting

### "Git: command not found"
Install Git: https://git-scm.com/download/mac

### "Can't scan QR code"
- Make sure iPhone has Camera permission for Expo Go
- Try the exp:// link method instead
- Make sure Mac and iPhone on same WiFi

### "App won't update on iPhone"
- In Expo Go, do a hard refresh (shake phone)
- Or close and reopen the app

### "Connection refused"
- Check you're on same WiFi (Mac and iPhone)
- Try: `npx expo start --tunnel`

### "I lost the exp:// link"
Just run again:
```bash
npx expo start
```
It generates a new one every time!

---

## 📊 What You Now Have

✅ Code on GitHub (version control)
✅ App runs on your iPhone  
✅ Shareable link for friends
✅ Easy to update anytime

---

## 🚀 Next Steps

1. **Customize colors/icons** (see above)
2. **Test on iPhone** via Expo Go
3. **Share your exp:// link** with friends
4. **Deploy to App Store** (later - more complex)

---

## 🔗 Helpful Links

| What | Link |
|------|------|
| Create GitHub account | https://github.com/signup |
| Create new repo | https://github.com/new |
| Download Expo Go | https://apps.apple.com/app/expo-go/id982107779 |
| Browse icon names | https://icons.expo.fyi/ |
| Expo documentation | https://docs.expo.dev/ |
| Color picker | https://colorpicker.com/ |

---

## 💡 Pro Tips

**Tip 1:** Save your exp:// link somewhere safe
- Bookmark it
- Screenshot it
- Paste in Notes

**Tip 2:** Use descriptive commit messages
```bash
git commit -m "Add new alarm for gym"     # Good ✅
git commit -m "stuff"                    # Bad ❌
```

**Tip 3:** Deploy to Expo Hosting (permanent URL)
```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

**Tip 4:** Share your GitHub repo link too!
```
https://github.com/YOUR_USERNAME/alarm-notifications-app
```

---

## ✨ You're Done!

Congratulations! You now have:
- A working Expo app on GitHub ✅
- A shareable iPhone link ✅
- Your own cool project! 🎉

**Questions?** Read `GITHUB_SETUP.md` for more details.

**Want to build more?** Go to Expo docs: https://docs.expo.dev/

Happy coding! 🚀
