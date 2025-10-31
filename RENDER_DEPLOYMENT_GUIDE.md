# 🚀 Deploy Food Delivery System to Render

## Step-by-Step Deployment Guide

### Prerequisites
- Render account (https://render.com) - Create a free account
- GitHub repository with your code
- MongoDB Atlas account (free tier)

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Render.com                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐        ┌──────────────────┐      │
│  │  Frontend        │        │  Backend API     │      │
│  │  (React.js)      │        │  (Express.js)    │      │
│  │  Static Site     │◄──────►│  Web Service     │      │
│  └──────────────────┘        └──────────────────┘      │
│                                       │                 │
│                                       ▼                 │
│                            ┌──────────────────┐        │
│                            │  MongoDB Atlas   │        │
│                            │  (Database)      │        │
│                            └──────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Part 1: Prepare Your Repository

### 1.1 Create a root `package.json` for Render (Optional but recommended)
Create `/package.json` in your project root:

```json
{
  "name": "food-delivery-system",
  "version": "1.0.0",
  "description": "Full-stack food delivery system",
  "main": "backend/server.js",
  "scripts": {
    "start": "cd backend && npm start",
    "install": "npm install && cd backend && npm install && cd ../frontend && npm install"
  }
}
```

### 1.2 Update Backend `package.json`
Make sure your `backend/package.json` has proper scripts:

```json
{
  "name": "food-delivery-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "socket.io": "^4.5.1",
    "cors": "^2.8.5",
    "axios": "^1.3.0"
  }
}
```

### 1.3 Create `.env.example` in backend:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5001
NODE_ENV=production
FRONTEND_URL=your_frontend_url
```

### 1.4 Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## 🗄️ Part 2: Set Up MongoDB Atlas

### 2.1 Create MongoDB Database
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Create a database user and password
5. Get connection string

### 2.2 Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

---

## 🔌 Part 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +"

### 3.2 Create Web Service (Backend)
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select repository: `food-delivery-system`
4. Fill in details:
   - **Name:** `food-delivery-api` (or your choice)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`

### 3.3 Add Environment Variables
Click **"Environment"** and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### 3.4 Deploy
- Click **"Create Web Service"**
- Wait for deployment (2-3 minutes)
- Copy the service URL (e.g., `https://food-delivery-api.onrender.com`)

---

## 🎨 Part 4: Deploy Frontend to Render

### 4.1 Build Frontend
```bash
cd frontend
npm run build
```

### 4.2 Create Static Site (Frontend)
1. Go back to Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Fill in details:
   - **Name:** `food-delivery-web` (or your choice)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
   - **Plan:** `Free`

### 4.3 Set Environment Variable for API
Before deploying, update `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://food-delivery-api.onrender.com';
export default API_BASE_URL;
```

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://food-delivery-api.onrender.com
```

### 4.4 Deploy Frontend
- Click **"Create Static Site"**
- Wait for deployment (2-3 minutes)
- Get your frontend URL (e.g., `https://food-delivery-web.onrender.com`)

---

## 🔗 Part 5: Configure CORS

Update your `backend/server.js` to allow your frontend URL:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://food-delivery-web.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Push this change:
```bash
git add backend/server.js
git commit -m "Update CORS for production deployment"
git push origin main
```

The backend will auto-redeploy on Render.

---

## 🧪 Part 6: Test Your Deployment

### 6.1 Test Backend API
```bash
curl https://food-delivery-api.onrender.com/api/restaurants
```

### 6.2 Test Frontend
Visit: `https://food-delivery-web.onrender.com`

### 6.3 Test User Signup
1. Go to signup page
2. Create a test account
3. Login and verify

### 6.4 Test Restaurant Features
1. Login as restaurant
2. Register restaurant
3. Add menu items

---

## 📝 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
- Check if backend service is running on Render
- Verify CORS settings
- Check if MongoDB connection string is correct
- Look at backend logs on Render

### Issue: "Database connection failed"
**Solution:**
- Verify MongoDB Atlas connection string
- Check IP whitelist (should be 0.0.0.0/0 for public access)
- Verify username and password

### Issue: "Frontend not loading styles"
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check if build was successful

### Issue: "Socket.io not connecting"
**Solution:**
- Update Socket.io client to connect to backend URL
- Add proper CORS settings for Socket.io
- Check browser console for errors

---

## 🔧 Render Configuration Checklist

### Backend Service:
- [ ] Name set
- [ ] GitHub repository connected
- [ ] Root directory: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] MONGODB_URI set
- [ ] JWT_SECRET set
- [ ] FRONTEND_URL set
- [ ] Free plan selected
- [ ] Auto-deploy enabled

### Frontend Static Site:
- [ ] Name set
- [ ] GitHub repository connected
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `build`
- [ ] REACT_APP_API_URL environment variable set
- [ ] Free plan selected
- [ ] Auto-deploy enabled

---

## 🚀 Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key_here
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://food-delivery-web.onrender.com
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://food-delivery-api.onrender.com
```

---

## 📊 Your Live URLs

After deployment, you'll have:
- **Backend API:** `https://food-delivery-api.onrender.com`
- **Frontend:** `https://food-delivery-web.onrender.com`

---

## 💡 Pro Tips

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - May take 30 seconds to start
   - Limited compute resources

2. **Improve Performance:**
   - Upgrade to paid plan when ready
   - Use CDN for static files
   - Optimize database queries

3. **Monitoring:**
   - Enable email notifications for failures
   - Monitor logs regularly
   - Set up error tracking (Sentry)

4. **Security:**
   - Never commit .env files
   - Rotate JWT secrets monthly
   - Use strong MongoDB passwords
   - Enable IP whitelist if possible

---

## 📞 Support

- Render Documentation: https://render.com/docs
- MongoDB Atlas Help: https://docs.atlas.mongodb.com
- Contact Render Support: support@render.com

---

**Deployment Complete! 🎉**

Your Food Delivery System is now live on Render!
