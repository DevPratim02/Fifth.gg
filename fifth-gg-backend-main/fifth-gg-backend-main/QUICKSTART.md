# 🚀 QUICK START GUIDE

Follow these steps IN ORDER to get your backend running:

## Step 1: Install Dependencies ✅
```bash
npm install
```

## Step 2: Configure Firebase 🔥

**IMPORTANT:** You need real Firebase credentials!

1. Go to https://console.firebase.google.com/
2. Select your project (or create one)
3. Go to: **Project Settings** → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download the JSON file
6. Open the `.env` file and update:
   ```env
   FIREBASE_PROJECT_ID=your-project-id-from-json
   FIREBASE_CLIENT_EMAIL=your-client-email-from-json
   FIREBASE_PRIVATE_KEY="paste-private-key-here"
   ```

## Step 3: Start PostgreSQL 🐘
```bash
docker-compose up -d
```

Wait 5 seconds for PostgreSQL to start, then verify:
```bash
docker-compose ps
```

You should see the `db` service running.

## Step 4: Run Database Migrations 📊
```bash
npm run migrate
```

You should see:
```
🚀 Starting database migrations...
✅ 001_create_users.sql completed
✅ 002_create_availability.sql completed
✅ 003_create_matches.sql completed
✅ 004_create_ranks.sql completed
🎉 All migrations completed successfully!
```

## Step 5: Start the Server 🎮
```bash
npm run dev
```

You should see:
```
Server running on port 4000 (development)
```

## ✅ You're Done!

Your backend is now running on: **http://localhost:4000**

## 🧪 Test It

### Test 1: Check if server is running
Open your browser and go to: http://localhost:4000/api/

You should see an error (because there's no route at `/api/`), but that means the server is running!

### Test 2: Connect with Socket.IO

Create a simple HTML file to test Socket.IO:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Socket.IO Test</title>
  <script src="https://cdn.socket.io/4.8.3/socket.io.min.js"></script>
</head>
<body>
  <h1>Socket.IO Connection Test</h1>
  <div id="status">Connecting...</div>

  <script>
    const socket = io('http://localhost:4000');
    
    socket.on('connect', () => {
      document.getElementById('status').innerHTML = '✅ Connected!';
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      document.getElementById('status').innerHTML = '❌ Disconnected';
      console.log('Disconnected from server');
    });
  </script>
</body>
</html>
```

Open this file in your browser. You should see "✅ Connected!"

## 🎯 Next Steps

1. **Build a Frontend** - Create a React/Vue/HTML frontend
2. **Implement Matchmaking Logic** - Add algorithm to pair players
3. **Test Authentication** - Get a Firebase token and test login
4. **Deploy** - Deploy to production when ready

## ⚠️ Common Issues

### "Cannot connect to database"
- Make sure PostgreSQL is running: `docker-compose ps`
- Check your `.env` file has correct database credentials

### "Firebase authentication failed"
- You MUST add real Firebase credentials to `.env`
- The default placeholder values won't work

### "Port 4000 already in use"
- Change `PORT=4000` to `PORT=5000` in `.env`
- Or stop the other process using port 4000

## 📚 Learn More

Read the full `README.md` for:
- Complete API documentation
- Socket.IO event reference
- Database schema details
- Deployment instructions

---

**Need help?** Check the README.md or open an issue!
