# Deployment Guide for MLB Odds Tracker

This guide covers deploying the MLB Odds Tracker to popular hosting platforms.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- The Odds API key from [the-odds-api.com](http://the-odds-api.com)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `.env.local` is in your `.gitignore` (it already is)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:

#### Required Environment Variables:
```bash
ODDS_API_KEY=your_real_api_key_here
ODDS_API_BASE_URL=https://api.the-odds-api.com/v4
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=+BI2PK0ERzN4rBbZZuzurbJ/7bprcp26Bmczs81vU/k=
ALLOWED_USERS=steven@example.com,user2@example.com
NODE_ENV=production
```

#### Generate NEXTAUTH_SECRET:
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### Step 3: Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy your app
3. Your app will be available at `https://your-app-name.vercel.app`

## 🏗️ Render Deployment

### Step 1: Prepare for Render
1. Push your code to GitHub
2. Create a `render.yaml` file (already created)

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Environment Variables
Add these environment variables in Render dashboard:
```bash
ODDS_API_KEY=your_real_api_key_here
ODDS_API_BASE_URL=https://api.the-odds-api.com/v4
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your_secure_32_character_secret_here
ALLOWED_USERS=steven@example.com,user2@example.com
NODE_ENV=production
```

## 🔧 Railway Deployment

### Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as above)

## ⚙️ Environment Variables Guide

### Required Variables:
- `ODDS_API_KEY`: Your API key from The Odds API
- `NEXTAUTH_URL`: Your deployed app URL
- `NEXTAUTH_SECRET`: 32+ character random string
- `ALLOWED_USERS`: Comma-separated list of authorized emails

### Optional Variables:
- `ODDS_API_BASE_URL`: API base URL (defaults to The Odds API)
- `NODE_ENV`: Set to "production" (usually auto-set)

## 🔒 Security Considerations

### For Production:
1. **Never commit `.env.local`** - Contains sensitive keys
2. **Use strong NEXTAUTH_SECRET** - Generate with `openssl rand -base64 32`
3. **Limit ALLOWED_USERS** - Only add authorized email addresses
4. **Monitor API usage** - Track your The Odds API quota
5. **Use HTTPS only** - Ensure NEXTAUTH_URL uses https://

## 📊 Post-Deployment Checklist

### After deployment:
- [ ] Test login with authorized email
- [ ] Verify API data is loading (check `/api/test-api`)
- [ ] Test date navigation
- [ ] Verify threshold settings save properly
- [ ] Check mobile responsiveness
- [ ] Monitor API quota usage

## 🐛 Troubleshooting

### Common Issues:

#### "API key not configured"
- Check `ODDS_API_KEY` environment variable is set
- Verify the API key is correct and active

#### "Login failed"
- Check `NEXTAUTH_SECRET` is set and valid
- Verify `NEXTAUTH_URL` matches your deployed URL
- Ensure email is in `ALLOWED_USERS` list

#### "No games found"
- Check The Odds API quota and usage
- Verify internet connectivity from hosting platform
- Test with `/api/test-api` endpoint

#### Build errors
- Run `npm run build` locally first
- Check all dependencies are in `package.json`
- Verify TypeScript types are correct

## 📈 Performance Optimization

### Included optimizations:
- Image optimization for team logos
- Static generation where possible
- Compressed responses
- Security headers
- SWC minification

### Monitoring:
- Use Vercel Analytics for performance monitoring
- Monitor The Odds API usage limits
- Set up error tracking (optional)

## 🔄 Updates and Maintenance

### To update the app:
1. Push changes to GitHub
2. Platform will auto-deploy (if configured)
3. Monitor deployment logs
4. Test new features

### API Management:
- Monitor The Odds API quota
- Consider upgrading API plan if needed
- Cache responses appropriately
