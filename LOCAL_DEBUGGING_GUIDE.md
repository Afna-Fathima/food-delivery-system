# 🐛 LOCAL DEBUGGING GUIDE - Step by Step

## 🎯 Your Current Setup

```
✅ MongoDB URI configured
✅ Environment variables set
✅ Backend code ready
❌ Need to debug why restaurants aren't showing
```

---

## 📊 DEBUGGING STEPS

### STEP 1️⃣: Check Backend is Running Locally

**Open Terminal and run:**

```bash
cd c:\Users\agust\Downloads\food-delivery-system\backend
npm start
```

**Expected Output:**
```
> food-delivery-backend@1.0.0 start
> node server.js

MongoDB connected successfully
Server running on port 5000
```

**If you see these messages → Backend is working ✅**

**If NOT → Check:**
- Is MongoDB Atlas cluster running? (Check https://www.mongodb.com/cloud/atlas)
- Is MONGODB_URI correct in .env?
- Is NODE_ENV=development set?

---

### STEP 2️⃣: Test Backend Health Endpoint

**Open new terminal and run:**

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"success": true, "message": "Backend is running", "port": 5000}
```

**If you see this → Backend API working ✅**

**If you get error:**
- Backend not running (check Step 1)
- Port 5000 blocked
- CORS issue

---

### STEP 3️⃣: Test Get Restaurants Endpoint

**Run:**

```bash
curl http://localhost:5000/api/restaurants
```

**Expected Response:**
```json
{"success": true, "data": []}
```
(Empty array is OK if no restaurants seeded yet)

**If you see this → API working ✅**

**If you get error:**
- Backend crashed
- Database not connected
- Route not defined

---

### STEP 4️⃣: Seed Database Locally

**Run:**

```bash
cd c:\Users\agust\Downloads\food-delivery-system\backend
node seed.js
```

**Expected Output:**
```
MongoDB connected for seeding...
Starting database seeding...
✓ Created user: raj@spicekingdom.com
✓ Created restaurant: Spice Kingdom
✓ Created restaurant: Pizza Parlour
... (more restaurants)
✓ Database seeding completed successfully!
```

**If you see this → Seeding worked ✅**

**If you see errors:**
- Check MongoDB connection
- Check MONGODB_URI has correct credentials
- Check database user permissions

---

### STEP 5️⃣: Verify Restaurants in Database

**After seeding, run:**

```bash
curl http://localhost:5000/api/restaurants
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Spice Kingdom",
      "rating": 4.7,
      "cuisines": ["Indian"],
      "deliveryTime": 25
    },
    ... (more restaurants)
  ]
}
```

**If you see restaurants → Database seeding worked ✅**

**If still empty:**
- Seeding failed silently (check logs)
- MongoDB not saving data
- Wrong database being used

---

### STEP 6️⃣: Start Frontend Locally

**Open new terminal:**

```bash
cd c:\Users\agust\Downloads\food-delivery-system\frontend
npm start
```

**This should open browser at:**
```
http://localhost:3000
```

**Check:**
- Does home page load?
- Does it show restaurants?
- Any errors in console?

---

## 🔍 COMMON DEBUGGING SCENARIOS

### Scenario 1: "MongoDB connection error"

**Check this:**

```bash
# 1. Verify .env file
cat backend\.env

# Should show:
# MONGODB_URI=mongodb+srv://afnafathima:afrin@cluster0...

# 2. Test connection directly in MongoDB Atlas
# Go to: https://www.mongodb.com/cloud/atlas
# Check if cluster is running

# 3. Verify IP whitelist
# Settings → Network Access
# Should allow "anywhere" (0.0.0.0/0) for local testing
```

**Fix:**
```
1. If cluster stopped → Start it
2. If IP blocked → Add your IP or "anywhere"
3. If wrong credentials → Update MONGODB_URI
```

---

### Scenario 2: "Cannot find module"

**Check this:**

```bash
cd backend
ls node_modules

# Should list all dependencies
```

**If folder missing or error:**

```bash
cd backend
npm install
# Wait for completion

npm start
```

---

### Scenario 3: "Port 5000 already in use"

**Check this:**

```bash
# Windows - Find what's using port 5000
netstat -ano | findstr :5000

# Should show:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345

# Kill that process
taskkill /PID 12345 /F
```

**Or use different port:**

```bash
cd backend
$env:PORT=5001
npm start
```

---

### Scenario 4: Frontend shows "Failed to load restaurants"

**Check browser console (F12):**

1. **Press F12 → Console tab**
2. **Look for red error messages**

**If you see CORS error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
```javascript
// In backend/server.js, line 20:
// Update CORS origin to include frontend URL:

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
```

**If you see 404 error:**
```
GET http://localhost:5001/api/restaurants 404
```

**Fix:**
- Check backend is running
- Check REACT_APP_API_URL in frontend/.env
- Should be: http://localhost:5001 (or your backend port)

**If you see timeout:**
```
GET http://localhost:5001/api/restaurants net::ERR_CONNECTION_REFUSED
```

**Fix:**
- Backend not running (start it)
- Wrong port (check frontend/.env)
- Firewall blocking (check Windows Defender)

---

## 🧪 COMPLETE DEBUG TEST SEQUENCE

**Run this entire sequence to test everything:**

### Terminal 1: Start Backend
```bash
cd c:\Users\agust\Downloads\food-delivery-system\backend
npm start

# Watch for:
# ✓ MongoDB connected successfully
# ✓ Server running on port 5000
```

### Terminal 2: Seed Database
```bash
cd c:\Users\agust\Downloads\food-delivery-system\backend
node seed.js

# Watch for:
# ✓ Database seeding completed successfully!
```

### Terminal 3: Test API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test restaurants endpoint
curl http://localhost:5000/api/restaurants

# Should return restaurant data
```

### Terminal 4: Start Frontend
```bash
cd c:\Users\agust\Downloads\food-delivery-system\frontend
npm start

# Browser opens at http://localhost:3000
# Check if restaurants appear
```

### Browser: Check Results
```
1. Open http://localhost:3000
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for any red errors
5. Check Network tab
6. Look for /api/restaurants request
7. Should show 200 status and restaurant data
```

---

## 📋 DEBUGGING CHECKLIST

### Backend Setup
- [ ] `backend/.env` file exists
- [ ] `MONGODB_URI` is set
- [ ] `JWT_SECRET` is set
- [ ] `PORT` is set (5000 or 5001)
- [ ] `NODE_ENV=development` is set

### MongoDB Setup
- [ ] MongoDB Atlas cluster is running
- [ ] Cluster is not in paused state
- [ ] IP whitelist includes your IP or "anywhere"
- [ ] Database user has correct password
- [ ] Connection string format is correct

### Backend Running
- [ ] `npm install` completed without errors
- [ ] `npm start` shows no errors
- [ ] Shows "MongoDB connected successfully"
- [ ] Shows "Server running on port XXXX"

### Database Data
- [ ] `node seed.js` ran without errors
- [ ] Saw "Database seeding completed successfully!"
- [ ] Database has restaurants (check MongoDB Atlas)

### Frontend Setup
- [ ] `frontend/.env` file exists (if needed)
- [ ] `REACT_APP_API_URL=http://localhost:5001` (or your backend port)
- [ ] `npm install` completed without errors
- [ ] `npm start` opens at http://localhost:3000

### Testing
- [ ] Health endpoint returns success: `curl http://localhost:5000/api/health`
- [ ] Restaurants endpoint returns data: `curl http://localhost:5000/api/restaurants`
- [ ] Frontend loads without console errors
- [ ] Restaurants visible on home page
- [ ] Can click restaurant and see menu

---

## 🆘 QUICK FIXES

### Issue: "Cannot connect to database"
```bash
# 1. Check MongoDB is running
# Go to https://www.mongodb.com/cloud/atlas

# 2. Verify credentials in .env
cat backend\.env
# Check MONGODB_URI carefully

# 3. Test locally first
# Comment out authentication to test

# 4. Restart backend
npm start
```

### Issue: "Port already in use"
```bash
# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
$env:PORT=5001
npm start
```

### Issue: "Module not found"
```bash
cd backend
npm install
npm start
```

### Issue: "CORS error in frontend"
```bash
# Update backend/server.js CORS configuration
# Make sure localhost:3000 is in origin array

# Then restart backend
npm start
```

### Issue: "Restaurant data not showing"
```bash
# 1. Verify backend is running
npm start

# 2. Verify database has data
node seed.js

# 3. Test API directly
curl http://localhost:5000/api/restaurants

# 4. Check frontend .env for correct API URL
cat frontend\.env
# Should have: REACT_APP_API_URL=http://localhost:5001
```

---

## 📝 LOCAL ENVIRONMENT VARIABLES

### `backend/.env` (You already have this)
```
MONGODB_URI=mongodb+srv://afnafathima:afrin@cluster0.n0friyv.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### `frontend/.env` (Create if missing)
```
REACT_APP_API_URL=http://localhost:5001
```

---

## 🎯 Expected Results After Each Step

| Step | Command | Expected Result |
|------|---------|-----------------|
| 1 | `npm start` (backend) | MongoDB connected ✅<br/>Server running ✅ |
| 2 | `curl /api/health` | `{"success": true}` ✅ |
| 3 | `curl /api/restaurants` | `{"data": []}` or restaurants ✅ |
| 4 | `node seed.js` | "Seeding completed" ✅ |
| 5 | `curl /api/restaurants` | 6 restaurants returned ✅ |
| 6 | `npm start` (frontend) | Page loads at localhost:3000 ✅ |
| 7 | Open localhost:3000 | Restaurants visible ✅ |

---

## 🔗 DEBUGGING LINKS

```
MongoDB Atlas:
  https://www.mongodb.com/cloud/atlas
  
Check Port Usage (Windows):
  netstat -ano | findstr :5000
  
Test API Online:
  https://httpie.io/ or use curl
  
Browser DevTools:
  F12 in any browser
```

---

## 📊 LOGS TO CHECK

### Backend Logs
```bash
# Run this and watch terminal
npm start

# Should show:
# MongoDB connected successfully
# Server running on port 5000
# No error messages
```

### Seeding Logs
```bash
# Run this and watch output
node seed.js

# Should show:
# MongoDB connected for seeding...
# Creating restaurants...
# Database seeding completed successfully!
```

### Frontend Logs (Browser Console)
```
F12 → Console tab
Should show NO red error messages
Should show API response with restaurants
```

---

## 🎯 NEXT: After Debugging Locally

Once everything works locally:

1. Push to GitHub
2. Render will auto-redeploy
3. Test on live URLs:
   - Frontend: https://food-delivery-system-1-25p5.onrender.com
   - Backend: https://food-delivery-backend.onrender.com/api/restaurants

---

## 💡 TIP: Start Fresh

If everything is messed up, try clean slate:

```bash
# 1. Stop backend (Ctrl+C)

# 2. Clear node modules and reinstall
cd backend
rm -r node_modules
npm install

# 3. Start backend
npm start

# 4. In new terminal, seed
node seed.js

# 5. Start frontend
cd ../frontend
npm start
```

---

**Ready to debug? Start with Step 1! 🚀**

