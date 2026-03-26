# Portfolio — Full Stack Application

A production-ready, full-stack portfolio application with a modern React frontend, Express backend, and MongoDB database. Features real-time theme support, admin dashboard with authentication, and full portfolio management capabilities.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm 9+
- **MongoDB** (local or cloud)

### Local Development

```bash
# Install all dependencies (monorepo workspaces)
npm run install:all

# Start both client and server with hot reload
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📋 Project Overview

This is a **monorepo** containing two main applications:

| Part | Technology | Purpose |
|------|-----------|---------|
| **Client** | React 19 + Vite + Framer Motion | Modern, interactive portfolio frontend |
| **Server** | Node.js + Express 5 + MongoDB | RESTful API for portfolio data management |

### Core Features

**Public Portfolio**
- Responsive, animated portfolio sections (Hero, Skills, Experience, Education, Projects, Contact)
- Light/dark theme support with persistent preferences
- Smooth scroll navigation
- Contact form with email notifications
- Interactive animations and magnetic cursor effects

**Admin Dashboard**
- Secure login with JWT authentication
- Manage portfolio content:
  - Projects
  - Skills
  - Work experience
  - Education
  - Personal details
  - File uploads (integrated with Cloudinary)
- Email notification system for contact form submissions

---

## 📁 Project Structure

```
portfolio/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Admin dashboard & login
│   │   │   ├── common/          # Shared UI components (Button, Card, Background)
│   │   │   └── sections/        # Portfolio sections (Hero, Skills, etc)
│   │   ├── contexts/            # React Context for theme management
│   │   ├── pages/               # Page components
│   │   └── services/            # API client service
│   ├── index.html
│   └── package.json
│
├── server/                 # Node.js/Express backend
│   ├── controllers/        # Route handlers for each resource
│   ├── models/             # Mongoose schemas (Project, Skill, Experience, etc)
│   ├── routes/             # API route definitions
│   ├── middlewares/        # Auth, validation, error handling, file upload
│   ├── config/             # Database configuration
│   ├── utils/              # Helper functions (mailer, response formatter, errors)
│   ├── uploads/            # Temporary upload storage
│   ├── tests/              # API smoke tests
│   ├── app.js              # Express app setup
│   ├── server.js           # Entry point
│   └── package.json
│
└── package.json            # Root monorepo configuration
```

---

## 🛠 Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **Framer Motion 12** — Animations
- **ESLint 9** — Code quality

### Backend
- **Express 5** — Web framework
- **MongoDB 7** — NoSQL database
- **Mongoose 8** — ODM
- **JWT** — Authentication
- **Multer + Cloudinary** — File uploads
- **Resend API (HTTPS)** — Email service
- **Helmet** — Security headers

---

## ⚙️ Environment Configuration

### Backend (.env)

Create `server/.env` in the server directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/portfolio_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
CONTACT_NOTIFY_EMAIL=your_email@gmail.com

# Cloudinary (File uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Personal Details (Displayed on portfolio)
PERSONAL_FULL_NAME=Your Name
PERSONAL_HEADLINE=Full Stack Developer
PERSONAL_BIO=I build scalable backend systems and modern frontend apps.
PERSONAL_EMAIL=you@example.com
PERSONAL_LOCATION=Your City, Country
PERSONAL_GITHUB=https://github.com/yourusername
PERSONAL_LINKEDIN=https://linkedin.com/in/yourusername
```

See `server/.env.example` for reference.

---

## 📦 Available Scripts

### Root Level (Monorepo)

```bash
# Development: Start both client and server with hot reload
npm run dev

# Production: Start both client and server
npm run start

# Testing: Run backend tests
npm run test

# Linting: Lint frontend code
npm run lint

# Building: Build frontend for production
npm run build

# Install all dependencies
npm run install:all
```

### Client Only

```bash
cd client

npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server Only

```bash
cd server

npm run dev      # Node with watch mode (--watch flag)
npm run start    # Run production server
npm run test     # Run tests with Node --test
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### Public Endpoints (GET only)

| Endpoint | Description |
|----------|-------------|
| `GET /api/projects` | List all projects |
| `GET /api/projects/:id` | Get project details |
| `GET /api/skills` | List all skills |
| `GET /api/experience` | List all work experience |
| `GET /api/education` | List all education entries |
| `GET /api/personal-details` | Get personal profile info |
| `POST /api/messages` | Submit contact form |

### Protected Endpoints (Admin only)

Require `Authorization: Bearer <JWT_TOKEN>` header.

**Projects**
- `POST /api/projects` — Create project
- `PATCH /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project

**Skills**
- `POST /api/skills` — Add skill
- `PATCH /api/skills/:id` — Update skill
- `DELETE /api/skills/:id` — Delete skill

**Experience**
- `POST /api/experience` — Add experience entry
- `PATCH /api/experience/:id` — Update entry
- `DELETE /api/experience/:id` — Delete entry

**Education**
- `POST /api/education` — Add education entry
- `PATCH /api/education/:id` — Update entry
- `DELETE /api/education/:id` — Delete entry

**Personal Details**
- `PATCH /api/personal-details` — Update profile info

**Admin Auth**
- `POST /api/auth/register` — Create admin account
- `POST /api/auth/login` — Get JWT token
- `POST /api/auth/logout` — Logout (frontend only)

**File Uploads**
- `POST /api/upload` — Upload file to Cloudinary (authenticated)

---

## 🔐 Authentication

The admin dashboard uses **JWT (JSON Web Tokens)** for authentication:

1. **Register/Login**: Submit credentials to `/api/auth/login`
2. **Receive Token**: JWT token returned in response
3. **Store Token**: Stored in browser localStorage
4. **Use Token**: Sent in `Authorization: Bearer <TOKEN>` header for admin requests
5. **Token Expiry**: Configurable via `JWT_EXPIRE` (default: 7 days)

---

## 📧 Email Configuration

The backend sends emails for:
- **Contact form submissions** → `CONTACT_NOTIFY_EMAIL`

### Resend Setup

1. Create a Resend account and API key
2. Add a verified sender/domain in Resend
3. Set in `.env`:
  ```env
  RESEND_API_KEY=re_your_resend_api_key
  RESEND_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
  CONTACT_NOTIFY_EMAIL=your_email@example.com
  ```

---

## 🔄 Development Workflow

### Adding a New Portfolio Section

1. **Create API model** (`server/models/`)
2. **Create controller** (`server/controllers/`)
3. **Create routes** (`server/routes/`)
4. **Create React component** (`client/src/components/sections/`)
5. **Call API** via `apiService` from `client/src/services/api.js`
6. **Add admin panel** in `client/src/components/admin/`

### Making Changes

- **Frontend**: Changes hot-reload (Vite)
- **Backend**: Use `npm run dev` for watch mode
- **Database**: MongoDB runs separately; use MongoDB Compass to inspect

---

## 🧪 Testing

```bash
# Run backend tests
npm run test

# Run specific test file
npm run test -- tests/app.smoke.test.js
```

---

## 📝 Key Configuration Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend environment variables |
| `client/vite.config.js` | Vite build & dev configuration |
| `server/middlewares/schemas.js` | Request validation schemas |

---

## ⚠️ Important Notes

- **Lockfiles**: Keep `server/package-lock.json` and `client/package-lock.json` in sync with their respective `package.json` files
- **CORS**: Backend allows requests from `CLIENT_URL` environment variable
- **Theme**: Light/dark theme preference stored in localStorage on frontend
- **Admin JWT**: Token expires after the `JWT_EXPIRE` duration; re-login required

---

## 🚀 Deployment

### Recommended Platforms

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, Heroku, or any Node.js hosting
- **Database**: MongoDB Atlas (cloud)
- **File Storage**: Cloudinary (for image uploads)

### Pre-deployment Checklist

- [ ] Set all required environment variables
- [ ] Update `CLIENT_URL` for CORS
- [ ] Configure Resend for email notifications
- [ ] Set up Cloudinary account
- [ ] Set strong `JWT_SECRET`
- [ ] Run `npm run build` for production frontend
- [ ] Test API endpoints in production
- [ ] Set `NODE_ENV=production`

---

## 📄 License

ISC License — see LICENSE file

---

## 💬 Support

For issues or questions:
1. Check `.env` configuration
2. Review console/terminal for errors
3. Verify MongoDB is running
4. Check JWT token expiry in admin features
