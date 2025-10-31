# 🔧 Environment Variables Guide

Complete list of all environment variables used in your food delivery system.

---

## 📋 Backend Environment Variables

Create a `.env` file in the `backend/` folder with these variables:

### Database Configuration
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery
```
- **Description:** MongoDB Atlas connection string
- **Format:** `mongodb+srv://username:password@clustername.mongodb.net/databasename`
- **Local:** `mongodb://localhost:27017/food-delivery`
- **Production:** MongoDB Atlas URL (get from https://www.mongodb.com/cloud/atlas)

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-change-this
```
- **Description:** Secret key for JWT token generation and verification
- **Length:** Minimum 32 characters recommended
- **Used in:** 
  - `authController.js` (line 83, 148)
  - `authMiddleware.js` (line 11)
- **Important:** Change this to a random string in production!

### Server Configuration
```
PORT=5001
```
- **Description:** Port on which backend server runs
- **Default:** 5000
- **Local Development:** 5001 (recommended)
- **Production (Render):** Auto-assigned, but you can set to 10000

### CORS Configuration
```
CLIENT_URL=http://localhost:3000
```
- **Description:** Frontend URL for CORS access
- **Local Development:** `http://localhost:3000`
- **Production (Render):** `https://your-frontend-domain.onrender.com`
- **Used in:**
  - `server.js` (line 12, 20)
  - Socket.IO CORS configuration
- **Note:** If not set, defaults to `http://localhost:3000` and `http://localhost:3001`

---

## 📱 Frontend Environment Variables

Create a `.env` file in the `frontend/` folder with these variables:

### API Configuration
```
REACT_APP_API_URL=http://localhost:5001
```
- **Description:** Backend API base URL
- **Local Development:** `http://localhost:5001`
- **Production (Render):** `https://your-backend-domain.onrender.com`
- **Used in:** `src/config/api.js` (line 4)
- **Note:** Must start with `REACT_APP_` to be accessible in React
- **Format:** No trailing slash

---

## 🚀 Quick Setup Templates

### For Local Development

**Backend (.env)**
```bash
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=local-dev-secret-key-12345678
PORT=5001
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5001
```

### For MongoDB Atlas (Cloud)

**Backend (.env)**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/food-delivery?retryWrites=true&w=majority
JWT_SECRET=production-secret-key-change-this-32chars
PORT=5001
CLIENT_URL=http://localhost:3000
```

### For Render Production Deployment

**Backend Environment Variables (in Render Dashboard)**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/food-delivery
JWT_SECRET=your-production-secret-key-32-chars-min
PORT=10000
CLIENT_URL=https://your-frontend-name.onrender.com
```

**Frontend Environment Variables (in Render Dashboard)**
```bash
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

---

## 📊 Environment Variables Reference Table

| Variable | Location | Used For | Example | Required |
|----------|----------|----------|---------|----------|
| `MONGODB_URI` | Backend `.env` | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` | ✅ Yes |
| `JWT_SECRET` | Backend `.env` | Token generation/verification | `your-secret-key-here` | ✅ Yes |
| `PORT` | Backend `.env` | Server port | `5001` | ❌ No (default: 5000) |
| `CLIENT_URL` | Backend `.env` | CORS origin & Socket.IO | `http://localhost:3000` | ❌ No (default: localhost:3000) |
| `REACT_APP_API_URL` | Frontend `.env` | API base URL | `http://localhost:5001` | ❌ No (default: localhost:5001) |

---

## 🔐 Security Best Practices

1. **Never commit `.env` files to Git**
   - Check `.gitignore` includes `*.env` and `.env.local`

2. **JWT_SECRET must be strong**
   - Minimum 32 characters
   - Use random characters, numbers, symbols
   - Example generator: https://www.random.org/strings/

3. **Different secrets for different environments**
   - Local: Simple secret (for development)
   - Production: Strong random secret (32+ chars)
   - Never use production secrets in local `.env`

4. **Render Environment Variables**
   - Set in Render Dashboard: Settings → Environment
   - Never hardcode in code
   - Use different values per environment

5. **MongoDB Security**
   - Use strong passwords
   - Restrict network access (IP whitelist)
   - Enable authentication on MongoDB
   - Use HTTPS URLs (mongodb+srv://)

---

## 🧪 Testing Your Environment Variables

### Backend Test
```bash
cd backend
npm start
# Should see: "Server running on port 5001"
# Should see: "MongoDB connected successfully"
```

### Frontend Test
```bash
cd frontend
npm start
# Should open at http://localhost:3000
# Should connect to backend API
```

### Health Check URL
```
http://localhost:5001/api/health
```
Response should show:
```json
{
  "success": true,
  "message": "Backend is running",
  "port": 5001
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
- Check `MONGODB_URI` format is correct
- Ensure MongoDB is running (local) or cluster exists (Atlas)
- Verify network access in MongoDB Atlas IP whitelist

### Issue: "JWT Error: secret must be provided"
**Solution:**
- Check `JWT_SECRET` is set in `.env`
- Restart backend server after adding variable
- Ensure `.env` file is in `backend/` folder, not root

### Issue: "Cannot reach backend API"
**Solution:**
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify backend is running and accessible
- Check browser console for CORS errors
- Ensure port matches (5001 for local)

### Issue: "Socket.IO connection refused"
**Solution:**
- Check `CLIENT_URL` in backend `.env`
- Ensure CORS configuration includes frontend URL
- Restart backend server
- Check Socket.IO client version matches server

### Issue: "Environment variables not loading"
**Solution (Frontend):**
- Variables must start with `REACT_APP_`
- Restart development server after changing `.env`
- Check `.env` is in `frontend/` root folder

**Solution (Backend):**
- Ensure `require('dotenv').config()` is first line of code
- Check `.env` is in `backend/` root folder
- Restart server after changes

---

## 📝 Step-by-Step Setup Instructions

### 1. Create Backend `.env`
```bash
cd backend
# Create new file
echo MONGODB_URI=mongodb://localhost:27017/food-delivery > .env
echo JWT_SECRET=dev-secret-key-12345 >> .env
echo PORT=5001 >> .env
echo CLIENT_URL=http://localhost:3000 >> .env
```

### 2. Create Frontend `.env`
```bash
cd ../frontend
echo REACT_APP_API_URL=http://localhost:5001 > .env
```

### 3. Verify Files Exist
```bash
# Backend
cat ../backend/.env

# Frontend
cat .env
```

### 4. Start Services
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

---

## 🎯 For Render Deployment

When deploying to Render, add these environment variables in the Render Dashboard:

### Backend Service
1. Go to Settings → Environment
2. Add each variable:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random 32+ char string |
| `PORT` | Leave empty (Render auto-assigns) or set to 10000 |
| `CLIENT_URL` | Your Render frontend URL (https://...) |

### Frontend Service
1. Go to Settings → Environment
2. Add variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | Your Render backend URL (https://...) |

---

## ✅ Checklist Before Deployment

- [ ] `MONGODB_URI` points to valid MongoDB Atlas cluster
- [ ] `JWT_SECRET` is strong (32+ chars, random)
- [ ] `CLIENT_URL` is set correctly for your environment
- [ ] `REACT_APP_API_URL` matches your backend URL
- [ ] `.env` files are in correct folders (backend/ and frontend/)
- [ ] `.gitignore` includes `*.env`
- [ ] Backend `.env` not committed to Git
- [ ] Frontend `.env` not committed to Git
- [ ] Local services test successfully with environment variables
- [ ] Render environment variables match deployed URLs

