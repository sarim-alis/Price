# Deployment Guide - Render

## Prerequisites
- GitHub account
- Render account (free tier works)
- MongoDB Atlas database (already configured)
- Cloudinary account (already configured)

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready for Render"
git push origin main
```

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Add environment variables (see below)
6. Click **"Apply"**

#### Option B: Manual Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `price-backend`
   - **Region**: Singapore (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `Backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Environment Variables
Add these in Render Dashboard → Environment:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=mongodb+srv://sarim:ali@pricess.pln37jy.mongodb.net/pricess?retryWrites=true&w=majority&appName=pricess
JWT_SECRET=dattebayo
CLOUDINARY_CLOUD_NAME=dgk3gaml0
CLOUDINARY_API_KEY=193114185223458
CLOUDINARY_API_SECRET=oPA92CNnlT4jVi0FQ710q6K2Gn8
CLOUDINARY_UPLOAD_PRESET=villas
ALLOWED_ORIGINS=https://yourfrontend.com,https://www.yourfrontend.com
```

**Important**: Update `ALLOWED_ORIGINS` with your actual frontend URL(s) separated by commas.

### 4. Verify Deployment
Once deployed, your backend will be available at:
```
https://price-backend.onrender.com
```

Test the health endpoint:
```
https://price-backend.onrender.com/health
```

## Production Features Added

✅ **Error Handling**: Global error handler with production/development modes  
✅ **CORS Configuration**: Environment-based CORS with allowed origins  
✅ **Health Check**: `/health` endpoint for monitoring  
✅ **Environment Variables**: Secure configuration via `.env`  
✅ **Node Version**: Specified in `package.json` for consistency  
✅ **Start Script**: Production-ready `npm start` command  

## Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for 1 service)

### Security Recommendations
1. **Change JWT_SECRET**: Use a strong, random secret in production
2. **Update ALLOWED_ORIGINS**: Replace with your actual frontend domain
3. **Database Security**: Ensure MongoDB Atlas has proper IP whitelisting
4. **API Keys**: Never commit `.env` file to Git (already in `.gitignore`)

### Monitoring
- View logs: Render Dashboard → Your Service → Logs
- Health check: `https://your-service.onrender.com/health`
- Render provides automatic HTTPS

## Troubleshooting

### Service Won't Start
- Check logs in Render Dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS`
- Format: `https://domain1.com,https://domain2.com`

### Database Connection Failed
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for Render)
- Verify `DATABASE_URL` is correct

## Updating Your Service
Render auto-deploys on every push to your main branch:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

## Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
