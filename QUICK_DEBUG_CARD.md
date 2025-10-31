# ⚡ QUICK DEBUG REFERENCE CARD

## 🎯 5-Minute Debug

### Open 4 Terminals

**Terminal 1: Start Backend**
```bash
cd c:\Users\agust\Downloads\food-delivery-system\backend
npm start
```
✅ Watch for: "MongoDB connected successfully"

---

**Terminal 2: Seed Database**
```bash
cd c:\Users\agust\Downloads\food-delivery-system\backend
node seed.js
```
✅ Watch for: "Database seeding completed successfully!"

---

**Terminal 3: Test API**
```bash
curl http://localhost:5000/api/restaurants
```
✅ Should show restaurant JSON data

---

**Terminal 4: Start Frontend**
```bash
cd c:\Users\agust\Downloads\food-delivery-system\frontend
npm start
```
✅ Opens at http://localhost:3000
✅ Should see 6 restaurants

---

## 🔍 If Something Fails

### Backend won't start
```bash
cd backend
npm install
npm start
```

### MongoDB connection fails
```
Check .env file:
  MONGODB_URI=mongodb+srv://afnafathima:afrin@cluster0...

Go to MongoDB Atlas:
  https://www.mongodb.com/cloud/atlas
  
Verify:
  ✓ Cluster is running (not paused)
  ✓ IP whitelist allows your IP
  ✓ Database user password is correct
```

### Port 5000 already in use
```bash
# Find what's using it
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID_NUMBER> /F

# Or use different port
$env:PORT=5001
npm start
```

### Frontend shows "Failed to load restaurants"

**Check F12 Console for errors:**

```
CORS Error?
  → Backend CORS not allowing frontend URL
  → Update backend/server.js line 20

404 Error?
  → Backend not running
  → Check frontend/.env REACT_APP_API_URL

Timeout Error?
  → Backend crashed
  → Check Terminal 1 for errors
```

### Seeding shows error
```bash
# Run with more debug info
cd backend
node seed.js

# If MongoDB error:
# - Check MONGODB_URI in .env
# - Go to MongoDB Atlas and verify cluster status

# If module error:
# npm install first, then:
# node seed.js
```

---

## ✅ Success Indicators

```
✓ Terminal 1: "Server running on port 5000"
✓ Terminal 2: "Database seeding completed successfully!"
✓ Terminal 3: Returns JSON with restaurants
✓ Frontend: Shows 6 restaurants on home page
✓ F12 Console: No red error messages
```

---

## 📊 Test Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

### Get Specific Restaurant
```bash
curl http://localhost:5000/api/restaurants/<id>
```

### Search Restaurants
```bash
curl "http://localhost:5000/api/restaurants?search=pizza"
```

---

## 🛠️ Restart Everything

```bash
# Terminal 1: Stop backend (Ctrl+C)
# Terminal 2-4: Stop others (Ctrl+C)

# Then restart in order:

# Terminal 1
cd backend && npm start

# Terminal 2
cd backend && node seed.js

# Terminal 3
curl http://localhost:5000/api/restaurants

# Terminal 4
cd frontend && npm start
```

---

## 🔐 Your Credentials

```
MongoDB:
  Username: afnafathima
  Password: afrin
  Cluster: cluster0

Test Restaurant:
  Email: raj@spicekingdom.com
  Password: password123

Test Customer:
  Email: arjun@customer.com
  Password: password123
```

---

## 📁 Key Files

```
Backend:
  backend/server.js          - Main server file
  backend/.env               - Environment variables
  backend/config/db.js       - Database connection
  backend/seed.js            - Seed data script
  backend/routes/            - API routes
  backend/controllers/       - API logic
  backend/models/            - Database schemas

Frontend:
  frontend/src/App.js        - Main app
  frontend/src/pages/Home.js - Home page
  frontend/src/config/api.js - API configuration
```

---

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | Backend not running | Run `npm start` |
| `Port already in use` | Port 5000 busy | Use `$env:PORT=5001` |
| `Cannot find module` | Dependencies missing | Run `npm install` |
| `MongoDB connection error` | Wrong credentials | Check MONGODB_URI |
| `CORS error` | Frontend URL not allowed | Update server.js |
| `No restaurants` | Database not seeded | Run `node seed.js` |
| `404 /api/restaurants` | Route not found | Check backend is running |

---

## 🎬 Step by Step

```
1. Start Backend     → npm start (backend)
2. Check Health      → curl /api/health
3. Seed Database     → node seed.js
4. Check Data        → curl /api/restaurants (should show 6)
5. Start Frontend    → npm start (frontend)
6. Open Browser      → http://localhost:3000
7. Verify            → Restaurants showing? ✅
8. Console Check     → F12 → No red errors? ✅
9. Test Features     → Click restaurant → Works? ✅
```

---

## 📞 Need Help?

Check these in order:

1. **Backend Logs** (Terminal 1)
   - Any red errors?
   - MongoDB connected?

2. **Seeding Logs** (Terminal 2)
   - Completed successfully?
   - Any errors during seeding?

3. **API Response** (Terminal 3 - curl command)
   - Returns data?
   - Or error message?

4. **Frontend Console** (F12 in browser)
   - Any red errors?
   - What's the error message?

5. **Check MongoDB Atlas**
   - Cluster running?
   - Data in database?

---

**Ready to debug? Pick a terminal and start! 🚀**

