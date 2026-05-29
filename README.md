# Gradeginie

A college management system built with a React frontend and an Express/MongoDB backend.

## Project Overview

- `client/` contains the React frontend built with Create React App.
- `server/` contains the Express API server with MongoDB integration.
- The frontend uses `axios` to call backend endpoints.
- The backend stores data in MongoDB and includes email/mail utilities.

## Tech Stack

- Frontend: React, React Router, Redux, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, dotenv, cors
- Deployment: frontend deployable as a static site, backend deployable on any Node host

## Repository Structure

- `client/` – React application
- `server/` – Express backend
- `server/Database/db.js` – MongoDB connection
- `server/index.js` – Express app entry point
- `server/routes/` – API routes
- `server/controllers/` – API request handlers
- `server/models/` – Mongoose models

## Local Setup

### 1. Install dependencies

```bash
git clone <repo-url>
cd Gradeginie
npm install --prefix server
npm install --prefix client
```

### 2. Configure backend environment

Create `server/.env` with:

```env
MONGODB_URI=<your-mongodb-connection-string>
FRONTEND_API_LINK=http://localhost:3000
EMAIL_USER=<your-email@example.com>
EMAIL_PASS=<your-email-password>
COLLEGE_NAME=Gradeginie
PORT=5000
```

### 3. Configure frontend environment

Create `client/.env` with:

```env
REACT_APP_APILINK=http://localhost:5000/api
```

### 4. Run locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm start
```

Then open `http://localhost:3000`.

## Available Commands

### Backend

- `npm start` – start the Express server
- `npm run dev` – start the backend with nodemon
- `npm run seed` – run the admin seeder script

### Frontend

- `npm start` – run the React app in development
- `npm run build` – build the production frontend
- `npm test` – run React tests

## Deployment

### Recommended setup

Deploy the backend and frontend separately:

1. Backend: host on Render, Railway, Heroku, Fly, or another Node host.
2. Frontend: deploy `client/` on Vercel or Netlify.

### Frontend deployment

- Deploy only the `client/` React app as a static site.
- Set the build command to `npm run build` and the output directory to `build`.
- Configure `REACT_APP_APILINK` with your backend URL.
- A `vercel.json` file is included in the repo root to help Vercel deploy only `client/`.

### Backend deployment notes

- Make sure `MONGODB_URI` is configured in the backend host.
- Set `FRONTEND_API_LINK` to the frontend URL.
- Add email credentials if mail features are needed.

## Environment Variables

### Backend (`server/.env`)

- `MONGODB_URI` – MongoDB connection string
- `FRONTEND_API_LINK` – frontend origin allowed by CORS
- `EMAIL_USER` – email account for sending email
- `EMAIL_PASS` – email password or app-specific password
- `COLLEGE_NAME` – optional display name for sender
- `PORT` – server port (default `5000`)

### Frontend (`client/.env`)

- `REACT_APP_APILINK` – base API URL for backend requests

## Notes

- The backend serves static media from `server/media`.
- The frontend expects the API base URL in `client/src/baseUrl.js`.
- If deploying to Vercel, do not deploy the entire root repo as a single Node app; deploy only `client/` and host `server/` separately.
