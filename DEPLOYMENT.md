# 🚀 Free Live Hosting Guide: Instagram Clone

Complete step-by-step guide to host your **Node.js + Express Backend** and **Angular 21 Frontend** 100% **FREE** on the internet.

---

## 🏗️ Architecture Overview
* **Database**: MongoDB Atlas *(Already hosted & active)*
* **Backend API**: [Render.com](https://render.com) *(100% Free Web Service)* or [Koyeb.com](https://koyeb.com)
* **Frontend UI**: [Vercel](https://vercel.com) *(100% Free Global CDN)* or [Netlify](https://netlify.com)

---

## Step 1: Push Project to GitHub

1. Open terminal in the project root: `c:\Users\Anirudh kashyap\Desktop\insta_clone`
2. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Instagram Clone full stack with MongoDB Atlas"
   ```
3. Create a new repository on [GitHub](https://github.com/new) (e.g., `instagram-clone`).
4. Link and push:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/instagram-clone.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Host Backend on Render (100% FREE)

1. Sign up / Log in to [Render.com](https://dashboard.render.com/) with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository (`instagram-clone`).
4. Configure the Web Service settings:
   * **Name**: `insta-clone-backend`
   * **Region**: Oregon (US West) or Singapore / Frankfurt
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Instance Type**: **Free** ($0/month)
5. Under **Environment Variables**, click **Add Environment Variable**:
   * Key: `MONGODB_URI`
   * Value: `mongodb+srv://anirudh67:ANan11@&@nodejs.lsqfprh.mongodb.net/insta_clone?retryWrites=true&w=majority`
   * Key: `PORT`
   * Value: `5000`
   * Key: `NODE_ENV`
   * Value: `production`
6. Click **Create Web Service**.
7. Render will build and deploy your API in ~2 minutes.
8. Copy your live backend URL (e.g. `https://insta-clone-backend.onrender.com`).
   * Test it by opening: `https://insta-clone-backend.onrender.com/api/health` -> should return `{"status": "online", "mongoConnected": true}`!

---

## Step 3: Host Frontend on Vercel (100% FREE)

1. Sign up / Log in to [Vercel](https://vercel.com/) with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`instagram-clone`).
4. In the Project Configuration:
   * **Root Directory**: Click "Edit" and choose `frontend`
   * **Framework Preset**: Angular *(Vercel detects automatically)*
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist/frontend/browser` *(or `dist/frontend`)*
5. Click **Deploy**.
6. Vercel will build your Angular app and assign a free HTTPS URL (e.g. `https://insta-clone-frontend.vercel.app`)!

---

## Step 4: Connect Frontend to Live Backend

Once your backend is live on Render:
1. You can set the live backend URL in `frontend/src/app/services/insights.service.ts`:
   ```typescript
   readonly apiUrl = 'https://<YOUR_RENDER_APP_NAME>.onrender.com/api';
   ```
2. Or dynamically in browser console / localStorage:
   ```javascript
   localStorage.setItem('API_URL', 'https://<YOUR_RENDER_APP_NAME>.onrender.com');
   ```

---

## ✅ Summary of Free URLs
* **Backend API**: `https://<your-app>.onrender.com/api/reels`
* **Frontend Web App**: `https://<your-app>.vercel.app`
* **Database**: MongoDB Atlas (ac-wxtilqk shard cluster)
