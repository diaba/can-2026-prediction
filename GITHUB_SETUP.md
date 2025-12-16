# GitHub Setup Guide

## Quick Steps to Host on GitHub

### 1. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `can-2026-prediction` (or your preferred name)
3. Description: "AI-powered prediction app for the 2026 African Cup of Nations"
4. Choose Public (so others can view it)
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### 2. Push to GitHub

Run these commands in the terminal:

```bash
cd /Users/habsa2war/bash/can

# Add remote repository
git remote add origin https://github.com/diaba/can-2026-prediction.git

# Rename branch to main (optional but recommended)
git branch -m master main

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages (For Free Web Hosting)

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Pages" section on the left
4. Under "Build and deployment":

   - Source: Select "Deploy from a branch"
   - Branch: Select "main" and "/root" folder
   - Click "Save"

5. Wait 1-2 minutes and your site will be live at:
   ```
   https://diaba.github.io/can-2026-prediction/
   ```

### 4. Verify It Works

- Visit your GitHub Pages URL
- The app should load and be fully functional
- Share the link with others!

## Commands Reference

```bash
# Clone repository locally
git clone https://github.com/diaba/can-2026-prediction.git

# Make changes to code
# Edit files as needed

# Stage changes
git add .

# Commit changes
git commit -m "Description of what changed"

# Push to GitHub
git push origin main

# Check status
git status

# View commit history
git log
```

## Current Repository Status

```
Repository Name: can-2026-prediction
Files:
  - index.html (Main app with UI and styles)
  - scritpt.js (ML model and prediction logic)
  - README.md (Documentation)
  - .gitignore (Files to exclude from git)

Total Size: ~1.3 MB
Branches: main
```

## Troubleshooting

**"Permission denied (publickey)"**

- Set up SSH key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**"Failed to push to GitHub"**

- Check internet connection
- Verify username and repository name in URL
- Try using HTTPS instead of SSH

**GitHub Pages not showing**

- Wait 1-2 minutes after enabling Pages
- Check Settings > Pages to ensure it's enabled
- Clear browser cache and reload

## Share Your App

Once live, share with:

- **Direct URL**: `https://YOUR_USERNAME.github.io/can-2026-prediction/`
- **GitHub URL**: `https://github.com/YOUR_USERNAME/can-2026-prediction`
- Include a screenshot or description in tweets/posts
- Add to your portfolio

## Protect Your Repository

Consider adding:

- Branch protection rules
- Require pull reviews for merges
- Add a LICENSE file (MIT recommended)
- Add CONTRIBUTING.md for collaboration guidelines

## Next Steps

1. Continue development
2. Fix bugs and add features
3. Create branches for new features
4. Submit pull requests for review
5. Keep README updated
6. Share with the community!

---

**Happy deploying! 🚀**
