# Instagram Clone Backend API (Node.js + Express + MongoDB Atlas)

Backend REST API for Instagram Reel Posts, Reel Insights, and Action Sheet menus connected to **MongoDB Atlas**.

---

## 🗄️ Database Configuration

The MongoDB Atlas cluster connects via `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://anirudh67:Anirudh123@nodejs.lsqfprh.mongodb.net/insta_clone?retryWrites=true&w=majority
MONGODB_URI_ALT=mongodb+srv://anirudh67:ANan11%40%26@nodejs.lsqfprh.mongodb.net/insta_clone?retryWrites=true&w=majority
NODE_ENV=development
```

> **Note on Special Characters:** When passwords have special symbols like `@` or `&`, they must be URL-encoded in the connection string (`@` -> `%40`, `&` -> `%26`). Both variations are supported via fallback in `config/db.js`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Seed Initial Database Data
Seeds MongoDB Atlas with the exact data from all 5 screenshots (Views: 260, Reached: 223, Avg Watch: 5s, Skip Rate: 55.9%, Followers: 50.8%, India: 100%, 18-24: 100%):
```bash
npm run seed
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode with auto-reload (nodemon)
npm run dev
```
The server will run on **`http://localhost:5000`**.

---

## 📡 API Endpoints

### 1. Reel Post Endpoints (`/api/reels`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reels/current` | Returns the current reel (`duo_brothers_65`, stats, sticker, etc.) |
| `GET` | `/api/reels/:id` | Get reel by ID |
| `POST` | `/api/reels/:id/like` | Toggle like state and increments/decrements like counter |
| `POST` | `/api/reels/:id/bookmark` | Toggle save/bookmark state and updates save counter |
| `POST` | `/api/reels/:id/view` | Increments view counter and updates accounts reached |
| `POST` | `/api/reels/:id/boost` | Initiates boost post workflow |
| `GET` | `/api/reels/:id/actions` | Returns list of 13 action sheet menu items (Image 4) |
| `POST` | `/api/reels/:id/actions/:actionId` | Executes action (archive, boost, hide likes/shares, etc.) |
| `PATCH`| `/api/reels/:id/settings` | Updates reel settings (hide counts, disable comments/reuse) |

### 2. Reel Insights Endpoints (`/api/insights`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/insights/current/overview` | **Overview Tab (Image 3)**: Views 260, Reached 223, Watch 5s, Follows 0, Skip Rate 55.9% |
| `GET` | `/api/insights/current/audience` | **Audience Tab (Images 1 & 2)**: Followers 50.8% vs 49.2%, India 100%, Age 18-24: 100% |
| `GET` | `/api/insights/current/engagement` | **Engagement Tab**: Accounts engaged (2), Likes (2), Saves (0), Comments (0) |
| `GET` | `/api/insights/:reelId` | Complete insights document |
| `PUT` | `/api/insights/:reelId` | Update insight metrics dynamically |

### 3. Utilities
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & MongoDB Atlas connection status |
| `POST`| `/api/seed` | Resets and re-seeds database with screenshot values |

---

## 📂 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection logic with retry & graceful fallback
├── models/
│   ├── Reel.js               # Mongoose schema for Reel posts
│   └── Insight.js            # Mongoose schema for Reel Insights (Overview, Audience, Engagement)
├── controllers/
│   ├── reelController.js     # Controller for Reel operations & settings
│   └── insightController.js  # Controller for Reel Insights metrics
├── routes/
│   ├── reelRoutes.js         # Routes for /api/reels
│   └── insightRoutes.js      # Routes for /api/insights
├── middleware/
│   └── errorHandler.js       # Centralized error handler
├── seed.js                   # Seeder script with screenshot data
├── server.js                 # Express app setup, CORS, and server startup
├── .env                      # Environment variables
├── .env.example              # Example environment config
└── package.json
```
