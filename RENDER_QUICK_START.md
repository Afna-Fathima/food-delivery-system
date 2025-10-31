# 🚀 Render Deployment Quick Start

## 5-Minute Quick Start

### Step 1: MongoDB Setup (2 min)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster → Get connection string
4. Copy: `mongodb+srv://username:password@cluster.mongodb.net/food-delivery`

### Step 2: Deploy Backend (1 min)
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Set:
   - **Name:** food-delivery-api
   - **Root Directory:** backend
   - **Build:** npm install
   - **Start:** node server.js
5. Add env variables:
   ```
   MONGODB_URI=your_connection_string
   JWT_SECRET=your_secret_key
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```
6. Deploy and copy URL

### Step 3: Deploy Frontend (1 min)
1. Click "New +" → "Static Site"
2. Connect GitHub repository
3. Set:
   - **Name:** food-delivery-web
   - **Root Directory:** frontend
   - **Build:** npm run build
   - **Publish:** build
4. Set env: `REACT_APP_API_URL=your_backend_url`
5. Deploy

### Step 4: Update CORS (1 min)
1. Edit `backend/server.js`
2. Update CORS with frontend URL
3. Push to GitHub (auto-redeploy)

### Step 5: Test
- Visit your frontend URL
- Test signup and login
- Test restaurant features

---

## Links You'll Need

- **Render:** https://render.com
- **MongoDB:** https://www.mongodb.com/cloud/atlas
- **Your GitHub:** https://github.com/Afna-Fathima/food-delivery-system

---

## Environment Variables Needed

### Backend
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/food-delivery
JWT_SECRET=afnafathima_secret_key_123
FRONTEND_URL=https://food-delivery-web.onrender.com
PORT=5001
NODE_ENV=production
```

### Frontend
```
REACT_APP_API_URL=https://food-delivery-api.onrender.com
```

---

## Test Credentials After Deployment

**Customer:**
- Email: arjun@customer.com
- Password: password123

**Restaurant Owner:**
- Email: raj@spicekingdom.com
- Password: password123

---

**Your Live App Will Be Live in ~5 minutes!** 🎉
