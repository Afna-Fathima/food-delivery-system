# 🖼️ Render Dashboard - Exact Settings Locations

## Where to Click on Render Dashboard

### Section 1: Accessing Settings

```
┌─────────────────────────────────────────────────────┐
│ Render Dashboard - Your Project                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  food-delivery-system                              │
│  ⚙️ Settings  ⬅️ CLICK HERE (gear icon top right) │
│                                                     │
│  Deployments | Events | Logs                       │
│  ═════════════════════════════════════════════════  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Section 2: Build & Deploy Settings

Once in Settings page, scroll down to **Build & Deploy**:

```
┌─────────────────────────────────────────────────────┐
│ Settings Page                                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ General                                             │
│ ─────────────────────────────────────────────────  │
│ • Name: food-delivery-system                       │
│ • Service ID: srv-d42js7qj27c7...                  │
│                                                     │
│ Build & Deploy ⬅️ SCROLL TO HERE                   │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Root Directory: [frontend] ⬅️ ENTER HERE   │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Build Command:                              │   │
│ │ [npm install && npm run build]              │   │
│ │ ⬅️ COPY-PASTE THIS                          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Publish Directory: [build] ⬅️ ENTER HERE   │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ Environment: Node ✓                                │
│                                                     │
│ ┌──────────────────────────────────────────────┐  │
│ │ [SAVE CHANGES] ⬅️ CLICK TO SAVE             │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Section 3: Environment Variables

Still in Settings page, scroll to **Environment**:

```
┌─────────────────────────────────────────────────────┐
│ Settings Page (continued)                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Environment ⬅️ SCROLL TO HERE                      │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Add Environment Variable ⬅️ CLICK BUTTON           │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Key: REACT_APP_API_URL                      │   │
│ │ ⬅️ ENTER THIS TEXT                          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Value: https://your-backend-xxx.onrender.com│  │
│ │ ⬅️ ENTER YOUR BACKEND URL HERE              │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ [ADD] ⬅️ CLICK TO ADD                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Section 4: Redeploy

Go back to main project page:

```
┌─────────────────────────────────────────────────────┐
│ food-delivery-system                                │
│ ⚙️ Settings  📋 Deployments  📊 Events  📝 Logs    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Manual Deploy ▼  [REDEPLOY LATEST COMMIT] ⬅️     │
│                                                     │
│ Deployments                                         │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ ✅ Deploy live (Nov 1, 4:30 AM)                   │
│    "Initial commit: Food delivery system..."       │
│                                                     │
│ 🔄 Deploy started (Nov 1, 4:06 AM)                │
│                                                     │
│ ❌ Deploy failed (Nov 1, 4:05 AM)                 │
│    ⬅️ THIS WAS THE BUILD COMMAND ERROR            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Step-by-Step Walkthrough

### ✅ Step 1: Click Settings
```
Location: Top right of your service page
Icon: ⚙️ (gear icon)
Label: "Settings"
```

### ✅ Step 2: Find Root Directory Field
```
Location: Under "Build & Deploy" section
Current value: (likely empty)
Action: Clear it, type: frontend
```

### ✅ Step 3: Find Build Command Field
```
Location: Under "Build & Deploy" section
Current value: (likely empty)
Action: Copy-paste this exactly:
npm install && npm run build
```

### ✅ Step 4: Find Publish Directory Field
```
Location: Under "Build & Deploy" section
Current value: build (or empty)
Action: Change to: build
```

### ✅ Step 5: Save Build Settings
```
Location: Bottom of Build & Deploy section
Button: "SAVE CHANGES" or similar
Action: Click it
```

### ✅ Step 6: Go to Environment Section
```
Location: Below Build & Deploy on same page
Or: Scroll down
```

### ✅ Step 7: Add Environment Variable
```
Location: Environment section
Button: "Add Environment Variable"
Action: Click it
```

### ✅ Step 8: Enter Key
```
Field: Key
Value: REACT_APP_API_URL
Important: No spaces, exact case
```

### ✅ Step 9: Enter Value
```
Field: Value
Value: https://YOUR-BACKEND-SERVICE-NAME.onrender.com
Example: https://food-delivery-backend-abc123.onrender.com

Note: Replace abc123 with your actual backend service ID
```

### ✅ Step 10: Add Variable
```
Button: "Add" or "Create"
Action: Click it
```

### ✅ Step 11: Redeploy
```
Location: Top of service page
Button: "REDEPLOY LATEST COMMIT" or "Manual Deploy"
Action: Click it and wait for ✅
```

---

## Finding Your Backend Service ID

Your backend URL will look like:
```
https://food-delivery-backend-XXXXX.onrender.com
                                ^^^^^ - This is the service ID part
```

When you deployed backend, Render gave you a URL. Use that URL in:
1. Frontend `REACT_APP_API_URL` environment variable
2. Backend `CLIENT_URL` environment variable

Example:
- Backend deployed to: `https://food-delivery-backend-d42js7qj.onrender.com`
- Set Frontend env: `REACT_APP_API_URL=https://food-delivery-backend-d42js7qj.onrender.com`
- Set Backend env: `CLIENT_URL=https://food-delivery-system-abcd1234.onrender.com`

---

## What to Expect at Each Stage

### During Redeploy

```
Page shows:
"Deploy in progress..."

You should see:
┌─────────────────────────────────┐
│ Deploy started [time]           │
│ Cloning from GitHub...          │
│ Running build command...        │
│ npm install...                  │
│ npm run build...                │
│ Finalizing...                   │
└─────────────────────────────────┘
```

### After Success ✅

```
Page shows:
✅ Deploy live [time]

Timeline:
- Cloning ✅
- Building ✅
- Publishing ✅
- Live ✅

Your app URL:
https://food-delivery-system-XXXX.onrender.com
```

### If Error ❌

```
Page shows:
❌ Build failed

Check:
1. Did you set Root Directory = frontend?
2. Did you set Build Command = npm install && npm run build?
3. Did you set Publish Directory = build?
4. Did you click Save Changes?
5. Did you click Redeploy after changing settings?
```

---

## Common Mistakes to Avoid

❌ **Wrong**
```
Root Directory: / (root)
Root Directory: (empty)
Root Directory: backend
Build Command: npm build (missing install)
Publish Directory: src
Publish Directory: (empty)
```

✅ **Right**
```
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

---

## After Deployment Works

### Test Your Frontend
1. Visit: `https://food-delivery-system-XXXX.onrender.com`
2. Should see: Food delivery homepage
3. Try: Sign up or login
4. Check: Browser console (F12) for errors

### If Page Blank
```
Check 1: Browser console (F12 → Console tab)
  Look for: "Cannot reach backend API"
  
Fix: Verify REACT_APP_API_URL is correct
  1. Go to Settings → Environment
  2. Check REACT_APP_API_URL value
  3. Should match your backend URL
  4. Redeploy frontend
```

### If Can't Login
```
Check 1: Network tab (F12 → Network)
  Look for: API calls
  Status: 200 (good) or 5xx (bad)
  
Check 2: If calls show 5xx errors
  Problem: Backend has issues
  Fix: Check backend service on Render
  
Check 3: If no API calls at all
  Problem: Frontend can't reach backend
  Fix: Update REACT_APP_API_URL environment variable
```

---

## Success Indicators ✅

After redeploy shows ✅ Deploy live:

```
✅ Page loads without errors
✅ See Food Delivery homepage
✅ Navigation works
✅ Console shows no major errors
✅ Can type in login form
✅ Network tab shows API calls going to backend
✅ API responses show 200-201 status
✅ Can log in or sign up
✅ App is LIVE! 🎉
```

