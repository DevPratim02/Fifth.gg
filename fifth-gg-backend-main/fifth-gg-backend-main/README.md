# Fifth.gg Backend

A real-time gaming matchmaking and chat platform backend built with Node.js, Express, Socket.IO, and PostgreSQL.

## 🚀 Features

- ✅ **Firebase Authentication** - Secure user authentication
- ✅ **Real-time Matchmaking** - Socket.IO powered matchmaking system
- ✅ **Live Chat** - Real-time chat with room support
- ✅ **Rank System** - MMR-based ranking with ELO calculations
- ✅ **Match History** - Track player matches and stats
- ✅ **RESTful API** - Complete REST API for all features
- ✅ **Docker Support** - Easy deployment with Docker

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 16+
- Docker & Docker Compose (optional)
- Firebase Project with Admin SDK credentials

## 🛠️ Installation

### 1. Clone the repository
```bash
cd fifth-gg-backend-main
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Edit the `.env` file with your actual credentials:

```env
NODE_ENV=development
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=fifthgg
DB_PASSWORD=strongpassword
DB_NAME=fifthgg_dev

# Firebase (IMPORTANT: Replace with your actual credentials)
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Start PostgreSQL

Using Docker Compose:
```bash
docker-compose up -d
```

Or install PostgreSQL locally and create the database:
```sql
CREATE DATABASE fifthgg_dev;
CREATE USER fifthgg WITH PASSWORD 'strongpassword';
GRANT ALL PRIVILEGES ON DATABASE fifthgg_dev TO fifthgg;
```

### 5. Run database migrations
```bash
npm run migrate
```

You should see:
```
🚀 Starting database migrations...

Running: 001_create_users.sql...
✅ 001_create_users.sql completed

Running: 002_create_availability.sql...
✅ 002_create_availability.sql completed

Running: 003_create_matches.sql...
✅ 003_create_matches.sql completed

Running: 004_create_ranks.sql...
✅ 004_create_ranks.sql completed

🎉 All migrations completed successfully!
```

### 6. Start the development server
```bash
npm run dev
```

The server will run on `http://localhost:4000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login or register with Firebase token

### Users
- `GET /api/users/:id` - Get user profile with ranks
- `PUT /api/users/:id` - Update user profile

### Availability
- `POST /api/availability/ready` - Mark user as ready for matchmaking
- `DELETE /api/availability/ready/:userId` - Remove user from queue
- `GET /api/availability/ready` - Get all ready users
- `GET /api/availability/ready/:userId` - Check if user is ready

### Matches
- `GET /api/match/:id` - Get match details
- `GET /api/match/history/:userId` - Get user's match history
- `POST /api/match` - Create a new match (admin/testing)

## 🔌 Socket.IO Events

### Matchmaking Events

**Client → Server:**
- `match:join` - Join matchmaking queue
  ```javascript
  socket.emit('match:join', { userId, gameMode, rankRange });
  ```
- `match:leave` - Leave matchmaking queue
  ```javascript
  socket.emit('match:leave', { userId });
  ```
- `match:accept` - Accept a found match
  ```javascript
  socket.emit('match:accept', { matchId, userId });
  ```
- `match:decline` - Decline a found match
  ```javascript
  socket.emit('match:decline', { matchId, userId });
  ```

**Server → Client:**
- `match:joined` - Confirmation of joining queue
- `match:found` - Match has been found
- `match:player_accepted` - A player accepted the match
- `match:started` - All players accepted, match started
- `match:cancelled` - Match was cancelled
- `match:error` - Error occurred

### Chat Events

**Client → Server:**
- `chat:join` - Join a chat room
  ```javascript
  socket.emit('chat:join', { roomId, userId });
  ```
- `chat:leave` - Leave a chat room
  ```javascript
  socket.emit('chat:leave', { roomId, userId });
  ```
- `chat:message` - Send a message
  ```javascript
  socket.emit('chat:message', { roomId, userId, username, message });
  ```
- `chat:typing` - Send typing indicator
  ```javascript
  socket.emit('chat:typing', { roomId, userId, username, isTyping });
  ```

**Server → Client:**
- `chat:history` - Chat history when joining room
- `chat:message` - New message received
- `chat:typing` - Someone is typing

## 🗄️ Database Schema

### Tables
- **users** - User accounts linked to Firebase
- **availability** - Users ready for matchmaking
- **matches** - Game sessions
- **match_participants** - Players in each match
- **user_ranks** - Player rankings and stats per game mode

## 🐳 Docker Deployment

### Build the image
```bash
docker build -t fifth-gg-backend .
```

### Run with Docker Compose
```bash
docker-compose up
```

## 📝 Development Workflow

1. **Start PostgreSQL**: `docker-compose up -d`
2. **Run migrations**: `npm run migrate`
3. **Start dev server**: `npm run dev`
4. **Make changes** - Server auto-restarts with nodemon
5. **Test with your frontend** or tools like Postman/Insomnia

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Copy the credentials to your `.env` file:
   - `projectId` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## 🎮 Game Modes

The system supports multiple game modes. Common examples:
- `competitive` - Ranked competitive matches
- `casual` - Unranked casual matches
- `custom` - Custom game modes

## 🏆 Rank System

The system uses MMR (Matchmaking Rating) with the following tiers:

| Rank | MMR Range |
|------|-----------|
| Iron | 0 - 999 |
| Bronze | 1000 - 1499 |
| Silver | 1500 - 1999 |
| Gold | 2000 - 2499 |
| Platinum | 2500 - 2999 |
| Diamond | 3000 - 3499 |
| Immortal | 3500 - 3999 |
| Radiant | 4000+ |

MMR changes are calculated using the ELO rating system.

## 🧪 Testing

Example using cURL:

```bash
# Login (requires Firebase ID token)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Mark user as ready
curl -X POST http://localhost:4000/api/availability/ready \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "gameMode": "competitive", "rankRange": "Gold"}'

# Get ready users
curl http://localhost:4000/api/availability/ready \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## 🚧 What's Next?

### Immediate Next Steps:
1. ✅ **Configure Firebase** - Add your real Firebase credentials
2. ✅ **Test Authentication** - Try logging in with a Firebase token
3. ✅ **Test Matchmaking** - Connect with Socket.IO client
4. ✅ **Build Frontend** - Create a frontend to interact with this backend

### Future Enhancements:
- [ ] Automated matchmaking algorithm
- [ ] Persistent chat messages in database
- [ ] Voice chat integration
- [ ] Player reporting system
- [ ] Admin dashboard
- [ ] Rate limiting per user
- [ ] Redis for caching
- [ ] Unit and integration tests
- [ ] API documentation (Swagger)

## 📚 Project Structure

```
src/
├── config/          # Configuration files
│   ├── db.js        # PostgreSQL connection
│   ├── firebase.js  # Firebase Admin SDK
│   ├── logger.js    # HTTP logging
│   └── index.js     # Environment config
├── controllers/     # Request handlers
├── db/
│   └── migrations/  # SQL migration files
├── middleware/      # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── sockets/         # Socket.IO handlers
├── utils/           # Utility functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

## 🆘 Troubleshooting

### Database connection fails
- Check PostgreSQL is running: `docker-compose ps`
- Verify `.env` credentials match your database

### Firebase authentication fails
- Ensure you've added real Firebase credentials to `.env`
- Check the private key format (should have `\n` for newlines)

### Migrations fail
- Drop and recreate the database if needed
- Check PostgreSQL logs for specific errors

### Socket.IO connection fails
- Check CORS settings in `server.js`
- Verify client is connecting to correct port (4000)

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for Fifth.gg**
