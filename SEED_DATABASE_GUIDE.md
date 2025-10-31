# 🌱 How to Seed Database - Visual Guide

## The Problem
```
Your database is empty!

No restaurants = Website shows nothing
```

## The Solution
```
Run seed.js = Database gets filled with 6 restaurants + test data
```

---

## 🎯 Method 1: Use Render Shell (EASIEST)

### Step 1: Open Render Dashboard
```
Go to: https://render.com
Look for your services
Click on: food-delivery-backend (the backend service)
```

### Step 2: Open Shell
```
In the backend service page, look at the top right
Click: "Shell" button
```

**What you'll see:**
```
A black terminal window opens
You should see a command prompt like:
  render@instance:~$
```

### Step 3: Run Seed Command
```
Type this command:
  cd backend && node seed.js

Then press ENTER
```

### Step 4: Wait for Output
```
You should see messages like:

✓ MongoDB connected for seeding...
✓ Starting database seeding...
✓ User already exists: raj@spicekingdom.com
✓ Created restaurant: Spice Kingdom
✓ Created restaurant: Pizza Parlour
✓ Created restaurant: Burger Barn
✓ Created restaurant: Sushi Paradise
✓ Created restaurant: China Kitchen
✓ Created restaurant: Sweet Scoop
✓ Created customer: arjun@customer.com
✓ Menu items created
✓ Database seeding completed successfully!
```

✅ **If you see this → SUCCESS!**

### Step 5: Verify It Worked
```
In your browser, visit:
  https://your-backend.onrender.com/api/restaurants

You should see JSON data with restaurants
```

---

## 🎯 Method 2: Run Locally (If Backend is on Your Computer)

### Step 1: Open Terminal
```
Windows:
  - Open PowerShell or Command Prompt
  - Navigate to: c:\Users\agust\Downloads\food-delivery-system

Mac/Linux:
  - Open Terminal
  - Navigate to your project folder
```

### Step 2: Go to Backend Folder
```bash
cd backend
```

### Step 3: Check .env File
```
Make sure backend/.env has:
  MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/food-delivery
  (or local: mongodb://localhost:27017/food-delivery)
```

### Step 4: Run Seed
```bash
node seed.js
```

### Step 5: Look for Success Message
```
Same output as Method 1:
✓ Database seeding completed successfully!
```

---

## 🧪 How to Test if Seeding Worked

### Test 1: Check API (Easiest)
```
Go to: https://your-backend.onrender.com/api/restaurants

You should see:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Spice Kingdom",
      "rating": 4.7,
      ...
    },
    {
      "name": "Pizza Parlour",
      ...
    },
    ... (more restaurants)
  ]
}
```

✅ If you see restaurants → Seeding worked!

### Test 2: Reload Frontend
```
1. Go to: https://food-delivery-system-1-25p5.onrender.com
2. Press: Ctrl+Shift+R (hard refresh)
3. Wait 5 seconds
4. You should see restaurants showing!
```

✅ If you see restaurants → COMPLETE SUCCESS!

### Test 3: Check MongoDB Atlas
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Login
3. Click your cluster
4. Go to: Collections
5. Click: food-delivery database
6. Look for: restaurants collection
7. Should show 6+ documents
```

✅ If you see documents → Data is in database!

---

## 🔍 Troubleshooting: What if I see an error?

### Error: "command not found: node"
```
Cause: Node.js not installed or not in PATH

Fix for Local:
  1. Install Node.js from: https://nodejs.org
  2. Restart terminal
  3. Try again: node seed.js

Fix for Render Shell:
  Contact support (shouldn't happen)
```

### Error: "Cannot find module 'mongoose'"
```
Cause: Dependencies not installed

Fix:
  1. In Render shell, run: cd backend && npm install
  2. Wait for completion
  3. Then run: node seed.js
```

### Error: "Error: connect ECONNREFUSED"
```
Cause: Cannot connect to database

Fix:
  1. Check MONGODB_URI is correct
  2. Check cluster is running in MongoDB Atlas
  3. Check IP whitelist in MongoDB Atlas (should be "anywhere" or 0.0.0.0/0)
  4. Wait 30 seconds
  5. Try again
```

### Error: "authentication failed"
```
Cause: Database credentials are wrong

Fix:
  1. Check username and password in MONGODB_URI
  2. Make sure they don't have special characters
  3. If they do, URL-encode them
  4. Visit MongoDB Atlas and verify credentials
  5. Update MONGODB_URI
  6. Redeploy backend (or restart local backend)
  7. Try seeding again
```

### Error: "Collection already exists" or "duplicate key"
```
Cause: Seeding already ran before

Solution: It's OK! Just means you already have data.

Check:
  Visit: https://your-backend.onrender.com/api/restaurants
  Should return data ✅
```

---

## 📊 What Gets Seeded

### 6 Restaurant Accounts
```
1. raj@spicekingdom.com / password123 - Indian food
2. marco@pizzaparlour.com / password123 - Italian pizza
3. alex@burgerbarn.com / password123 - Burgers & fries
4. priya@sushiparadise.com / password123 - Japanese sushi
5. wei@chinakitchen.com / password123 - Chinese food
6. raj@sweetscoop.com / password123 - Ice cream & desserts
```

### 1 Customer Account
```
arjun@customer.com / password123
```

### 6 Restaurants with 20-30 Menu Items Each
```
1. Spice Kingdom - 30+ items
2. Pizza Parlour - 20+ items
3. Burger Barn - 25+ items
4. Sushi Paradise - 20+ items
5. China Kitchen - 25+ items
6. Sweet Scoop - 15+ items
```

---

## ✅ Next Steps After Seeding

1. **Reload Frontend**
   - Visit: https://food-delivery-system-1-25p5.onrender.com
   - Hard refresh: Ctrl+Shift+R
   - Restaurants should appear ✅

2. **Test Signup**
   - Click "Sign Up"
   - Create new customer account
   - Should work ✅

3. **Test Login**
   - Click "Log In"
   - Use: arjun@customer.com / password123
   - Should work ✅

4. **Test Browse Restaurants**
   - Click on a restaurant
   - Should see menu items ✅

5. **Test Add to Cart**
   - Click "Add to Cart"
   - Should add item ✅

6. **Test Checkout**
   - Go to cart
   - Click checkout
   - Should create order ✅

---

## 🎯 One-Line Summary

```
If restaurants don't show → Run seed.js → Restaurants appear
```

