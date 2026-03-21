# Vercel Deployment Guide - Admin Frontend

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- Backend deployed on Render (for API URL)

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel

#### Option A: Using GitHub Integration (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `Admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add environment variables (see below)
7. Click **"Deploy"**

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to Admin directory
cd Admin

# Deploy
vercel --prod
```

### 3. Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend.onrender.com
```

**Important**: Replace with your actual Render backend URL.

### 4. Verify Deployment
Once deployed, your frontend will be available at:
```
https://your-project-name.vercel.app
```

## Vercel Features Added

✅ **Auto-Detection**: Vercel automatically detects Vite projects  
✅ **SPA Routing**: Handles React Router with rewrite rules  
✅ **Environment Variables**: Secure `.env` management  
✅ **Build Optimization**: Optimized build configuration  
✅ **HTTPS**: Automatic SSL certificate  

## Production Features

### Build Configuration
- Optimized asset bundling
- Source maps disabled for production
- Proper output directory structure

### Environment Variables
- Frontend uses `VITE_API_URL` from environment
- Secure storage in Vercel dashboard
- No secrets in codebase

### SPA Routing
- All routes redirect to `index.html`
- Supports React Router properly
- No 404 errors on refresh

## Important Notes

### Free Tier Benefits
- 100GB bandwidth/month
- 100 builds/month
- Custom domains supported
- Automatic HTTPS

### Environment Variables
- Must start with `VITE_` for Vite
- Available in browser via `import.meta.env`
- Securely stored in Vercel dashboard

### Performance
- Global CDN distribution
- Automatic optimization
- Fast loading times

## Updating Your App
Vercel auto-deploys on every push to your main branch:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

## Custom Domain (Optional)
1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel provides SSL automatically

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify `VITE_API_URL` is set correctly

### API Calls Fail
- Check `VITE_API_URL` environment variable
- Verify backend is deployed and accessible
- Check CORS settings on backend

### 404 Errors on Refresh
- Vercel configuration handles SPA routing
- If issues occur, check `vercel.json` rewrites

## Security Tips

1. **Environment Variables**: Never commit `.env` to Git
2. **API Security**: Use HTTPS endpoints
3. **CORS**: Configure backend to allow your Vercel domain
4. **Dependencies**: Keep packages updated

## Monitoring
- Vercel Dashboard provides analytics
- Build logs and deployment history
- Performance metrics available

## Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://vercel.com/community)
