# 🔧 Why Restaurants Won't Show - Complete Troubleshooting

## 🎯 The Real Problem

✅ MongoDB is connected
✅ Backend is running
✅ API endpoint exists

❌ **NO RESTAURANTS IN DATABASE!**

The database is empty. You need to seed test data.

---

## 🚨 How to Fix (3 Steps)

### STEP 1: Verify Backend is Actually Running
```bash
# Check logs from Render deployment
Should see:
  ✓ MongoDB connected successfully
  ✓ Server running on port 10000
  ✓ Backend is live
```

### STEP 2: Seed the Database with Test Restaurants

**Option A: Seed via Render Dashboard (RECOMMENDED)**

1. Go to Render Dashboard: https://render.com
2. Click your backend service
3. Go to **Shell** (top right)
4. Run this command:
   ```bash
   cd backend && node seed.js
   ```
5. Wait for output showing:
   ```
   ✓ Created user: raj@spicekingdom.com
   ✓ Created user: marco@pizzaparlour.com
   ✓ Created restaurant: Spice Kingdom
   ✓ Created restaurant: Pizza Parlour
   ... (and more)
   ✓ Database seeding completed successfully!
   ```

**Option B: Seed Locally (if running backend locally)**

1. Open terminal in your project folder
2. Run:
   ```bash
   cd backend
   node seed.js
   ```
3. You should see same output as Option A

### STEP 3: Verify Restaurants Loaded

**Check Backend API:**
```
Visit: https://your-backend.onrender.com/api/restaurants
```

You should see JSON response with restaurants:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Spice Kingdom",
      "description": "Authentic Indian cuisine...",
      "cuisine": ["Indian", "North Indian", "Vegetarian"],
      "rating": 4.7,
      "deliveryTime": 25
    },
    {
      "_id": "...",
      "name": "Pizza Parlour",
      ...
    }
  ]
}
```

✅ If you see this → Continue to Step 4

❌ If you see empty array `[]` → Seeding didn't work, check logs

### STEP 4: Reload Frontend

1. Visit your frontend: `https://food-delivery-system-1-25p5.onrender.com`
2. Hard refresh: **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac)
3. Wait for page to load
4. **Restaurants should now appear!** ✅

---

## 📋 What Gets Seeded

The `seed.js` file creates:

### 6 Restaurant Users
| Email | Password |
|-------|----------|
| `raj@spicekingdom.com` | `password123` |
| `marco@pizzaparlour.com` | `password123` |
| `alex@burgerbarn.com` | `password123` |
| `priya@sushiparadise.com` | `password123` |
| `wei@chinakitchen.com` | `password123` |
| `raj@sweetscoop.com` | `password123` |

### 1 Customer User
| Email | Password |
|-------|----------|
| `arjun@customer.com` | `password123` |

### 6 Restaurants with Menu Items
1. **Spice Kingdom** - Indian cuisine (30+ items)
2. **Pizza Parlour** - Italian cuisine (20+ items)
3. **Burger Barn** - Fast food (25+ items)
4. **Sushi Paradise** - Japanese (20+ items)
5. **China Kitchen** - Chinese (25+ items)
6. **Sweet Scoop** - Desserts (15+ items)

---

## 🔍 How to Check if Seeding Worked

### Check 1: API Response
```bash
curl https://your-backend.onrender.com/api/restaurants
```

Should return array with 6+ restaurants ✅

### Check 2: Browser Network Tab
1. Open frontend URL
2. Press **F12** (Developer Tools)
3. Go to **Network** tab
4. Refresh page
5. Look for request to `/api/restaurants`
6. Check response (should have restaurant data)

### Check 3: MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Click your cluster
3. Go to **Collections**
4. Expand `food-delivery` database
5. Click `restaurants` collection
6. Should show 6 documents

---

## ❌ Common Issues & Fixes

### Issue: Seeding shows "error: connect ECONNREFUSED"

**Cause:** Backend service is down or restarting

**Fix:**
1. In Render, restart backend service
2. Wait 30-60 seconds
3. Try seeding again
4. Or check logs to see if backend started

### Issue: Seeding shows "MongoServerError: authentication failed"

**Cause:** MongoDB URI is wrong or credentials incorrect

**Fix:**
1. Check `MONGODB_URI` in Render backend env vars
2. Verify format: `mongodb+srv://user:password@cluster.mongodb.net/database`
3. Check username and password don't have special characters
4. If they do, URL-encode them (use MongoDB Atlas website to verify)
5. Update env var and redeploy backend

### Issue: Seeding shows "TypeError: Cannot read property..."

**Cause:** Missing dependencies in backend

**Fix:**
1. Run in Render shell:
   ```bash
   cd backend && npm install
   ```
2. Wait for npm install to complete
3. Then try seeding again

### Issue: Still shows "Failed to load restaurants" on frontend

**Fix:**
1. Hard refresh frontend: **Ctrl+Shift+R**
2. Wait 10 seconds
3. Check browser console (**F12** → Console)
4. Look for error message about API call
5. If error, note what it says and check below

### Issue: Frontend shows CORS error

**Cause:** `CLIENT_URL` not set in backend

**Fix:**
1. In Render backend service → Settings → Environment Variables
2. Add/Update: `CLIENT_URL=https://food-delivery-system-1-25p5.onrender.com`
3. Redeploy backend
4. Hard refresh frontend

---

## 📊 Flowchart: Why it's not working

```
MongoDB Connected ✅
    ↓
Restaurant Collection Empty? ← YOU ARE HERE
    ↓ YES
Run seed.js
    ↓
Restaurants Created ✅
    ↓
Frontend Calls /api/restaurants ← Make sure REACT_APP_API_URL is set
    ↓
API returns restaurants ✅
    ↓
Frontend displays them ✅
```

---

## 🚀 Quick Test Commands

### Test Backend Health
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{"success": true, "message": "Backend is running", "port": 10000}
```

### Test Get Restaurants
```bash
curl https://your-backend.onrender.com/api/restaurants
```

Expected response:
```json
{"success": true, "data": [{...6 restaurants...}]}
```

### Test with Search
```bash
curl "https://your-backend.onrender.com/api/restaurants?search=pizza"
```

Should return Pizza Parlour ✅

---

## ✅ Final Checklist Before Frontend Test

- [ ] Backend is running (logs show "Server running on port 10000")
- [ ] MongoDB is connected (logs show "MongoDB connected successfully")
- [ ] Environment variables set (MONGODB_URI, JWT_SECRET, CLIENT_URL)
- [ ] Seeding has been run (`node seed.js`)
- [ ] Seeding completed without errors
- [ ] API returns restaurants (`/api/restaurants` returns data)
- [ ] Frontend URL has REACT_APP_API_URL set correctly
- [ ] Frontend has been redeployed after env var update
- [ ] Browser cache cleared (hard refresh: Ctrl+Shift+R)

---

## 📞 Still Not Working?

Follow this debugging path:

1. **Check Backend Logs**
   - Render Dashboard → Backend Service → Logs
   - Should show no errors

2. **Check MongoDB Connection**
   - Look for: "MongoDB connected successfully"
   - If not there, MONGODB_URI is wrong

3. **Run Seeding**
   - Render Dashboard → Backend Service → Shell
   - Run: `cd backend && node seed.js`
   - Should show success messages

4. **Test API Directly**
   - Visit: `https://backend.onrender.com/api/restaurants`
   - Should return restaurants as JSON

5. **Check Frontend Console**
   - Open frontend → Press F12
   - Console tab should show no CORS errors
   - Network tab should show successful API call to `/api/restaurants`

6. **Check Frontend Env Vars**
   - Render Dashboard → Frontend Service → Settings
   - Environment Variables should include: `REACT_APP_API_URL=https://backend.onrender.com`

---

## 🎯 Expected End Result

```
✅ Frontend loads
✅ Shows 6 restaurants
✅ Search works
✅ Click restaurant shows menu
✅ Can add items to cart
✅ Signup/Login works
```

