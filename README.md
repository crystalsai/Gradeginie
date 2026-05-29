# Gradeginie

A college management system built with a React frontend and an Express/MongoDB backend.

Live site: https://gradeginie.vercel.app

## Project Overview

- `client/` contains the React frontend built with Create React App.
- `server/` contains the Express API server with MongoDB integration.
- The frontend calls backend endpoints through `/api` in production.
- The backend stores data in MongoDB Atlas and sends email notifications with Gmail SMTP.
- Uploaded profile/media files work locally from `server/media`; on Vercel, uploads are stored as data URLs because serverless filesystem writes are not persistent.

## Tech Stack

- Frontend: React, React Router, Redux, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, Multer, Nodemailer, dotenv, cors
- Deployment: Vercel full-stack deployment from the root `vercel.json`

## Repository Structure

- `client/` - React application
- `server/` - Express backend
- `server/Database/db.js` - MongoDB connection
- `server/index.js` - Express app entry point
- `server/routes/` - API routes
- `server/controllers/` - API request handlers
- `server/models/` - Mongoose models
- `server/middlewares/multer.middleware.js` - upload handling
- `server/utils/mailer.js` - email helpers

## Local Setup

### 1. Install Dependencies

```bash
git clone <repo-url>
cd Gradeginie
npm install --prefix server
npm install --prefix client
```

### 2. Configure Backend Environment

Copy `server/.env.example` to `server/.env` and fill in real values:

```env
MONGODB_URI=<your-mongodb-connection-string>
PORT=8000
FRONTEND_API_LINK=http://localhost:3000
EMAIL_USER=<your-gmail-address>
EMAIL_PASS=<your-gmail-app-password>
COLLEGE_NAME=EduPortal College
```

For Gmail, `EMAIL_PASS` should be a Google App Password, not your normal Gmail password.

### 3. Configure Frontend Environment

Copy `client/.env.example` to `client/.env`.

For local frontend talking to the online backend:

```env
REACT_APP_APILINK=https://gradeginie.vercel.app/api
REACT_APP_MEDIA_LINK=https://gradeginie.vercel.app/media
```

For local frontend talking to a local backend:

```env
REACT_APP_APILINK=http://localhost:8000/api
REACT_APP_MEDIA_LINK=http://localhost:8000/media
```

### 4. Run Locally

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

- `npm start` - start the Express server
- `npm run dev` - start the backend with nodemon
- `npm run seed` - run the admin seeder script

### Frontend

- `npm start` - run the React app in development
- `npm run build` - build the production frontend
- `npm test` - run React tests

## Deployment

The project is deployed to Vercel from the repository root.

Root `vercel.json`:

- Builds `client/package.json` as a static React app.
- Builds `server/index.js` as a Vercel Node function.
- Routes `/api/*` and `/media/*` to the backend.
- Routes frontend pages to the React app.

Production URL:

```text
https://gradeginie.vercel.app
```

Deploy:

```bash
npx vercel --prod
```

Required Vercel environment variables:

- `MONGODB_URI`
- `FRONTEND_API_LINK`
- `EMAIL_USER`
- `EMAIL_PASS`
- `COLLEGE_NAME`

## Environment Variables

### Backend (`server/.env`)

- `MONGODB_URI` - MongoDB connection string
- `PORT` - local backend port, currently `8000`
- `FRONTEND_API_LINK` - frontend origin allowed by CORS
- `EMAIL_USER` - email account for sending email
- `EMAIL_PASS` - Gmail app password
- `COLLEGE_NAME` - display name used in emails

### Frontend (`client/.env`)

- `REACT_APP_APILINK` - base API URL for backend requests
- `REACT_APP_MEDIA_LINK` - base media URL for uploaded files

## Notes

- Do not commit real `.env` files. Use `.env.example` files for templates.
- New student/faculty registration sends welcome emails when SMTP credentials are valid.
- Deleting a student or faculty member also removes the matching login credential, so the same enrollment number or employee ID can be reused.
- The deployed backend logs `MongoDB connected successfully` when the database connection works.
