https://complain-system-l8tr.vercel.app/
# Redress — Smart Complaint Management System

A full MERN-stack (MongoDB + Express + React + Node.js) complaint management
system for an educational institution, built for a hackathon.

Users register, wait for admin approval, log in through a single login page,
submit and track complaints. Admins approve/manage users, and manage the
full complaint lifecycle (Pending → In Progress → Resolved / Rejected).

## Project structure

```
smart-complaint-system/
├── backend/     Express + Mongoose API (connects to MongoDB Atlas)
└── frontend/    React (Vite) + Tailwind CSS UI
```

## 1. Prerequisites

- Node.js 18+ and npm
- A free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
  1. Create a cluster (the free M0 tier works fine).
  2. Under **Database Access**, create a database user with a username/password.
  3. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for
     quick testing).
  4. Click **Connect → Drivers**, copy the connection string. It looks like:
     `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart-complaint-db?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@institution.edu
ADMIN_PASSWORD=ChangeThisPassword123!
CLIENT_URL=http://localhost:5173
```

Create the initial administrator account (required — a new registration can
never make itself an admin):

```bash
npm run seed:admin
```

Start the API:

```bash
npm run dev      # with nodemon, auto-restarts
# or
npm start
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` should point at your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

- Log in as the seeded admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) to reach the
  admin dashboard, approve new accounts, and manage complaints.
- Register a new account from `/register` — it will sit in **Manage users →
  Pending** until an admin approves it.

## 4. Building for production

```bash
cd frontend
npm run build       # outputs static files to frontend/dist
```

Deploy `backend/` to any Node host (Render, Railway, Fly.io, EC2, etc.) with
your `.env` variables set, and serve `frontend/dist` from any static host
(Vercel, Netlify, S3 + CloudFront). Update `VITE_API_URL` and `CLIENT_URL`
to your deployed URLs.

## API overview

| Method | Route                          | Access        | Description                      |
|--------|--------------------------------|---------------|-----------------------------------|
| POST   | /api/auth/register              | Public        | Register (status: pending)        |
| POST   | /api/auth/login                 | Public        | Login (single login for all roles)|
| GET    | /api/auth/me                    | Authenticated | Current user profile              |
| GET    | /api/users                      | Admin         | List users (filter by status/role)|
| GET    | /api/users/stats                | Admin         | User statistics                   |
| PATCH  | /api/users/:id/approve          | Admin         | Approve a pending account          |
| PATCH  | /api/users/:id/reject           | Admin         | Reject a pending account           |
| PATCH  | /api/users/:id/toggle-active    | Admin         | Activate/deactivate an account     |
| PATCH  | /api/users/:id/role             | Admin         | Change a user's role               |
| POST   | /api/complaints                 | User          | Submit a complaint                 |
| GET    | /api/complaints/mine             | User          | View own complaints                |
| PUT    | /api/complaints/:id              | Owner         | Edit own complaint (Pending only)  |
| DELETE | /api/complaints/:id              | Owner         | Delete own complaint (Pending only)|
| GET    | /api/complaints                 | Admin         | View/search/filter all complaints  |
| GET    | /api/complaints/stats            | Admin         | Complaint statistics               |
| PATCH  | /api/complaints/:id/status        | Admin         | Update status + remarks            |
| GET    | /api/complaints/:id               | Owner/Admin   | View a single complaint            |

## Tech stack

- **Frontend:** React 18, React Router, Vite, Tailwind CSS, lucide-react icons, axios
- **Backend:** Node.js, Express, Mongoose, JWT auth, bcrypt password hashing, express-validator
- **Database:** MongoDB Atlas

## Security notes

- Passwords are hashed with bcrypt and never returned by the API.
- JWTs are verified against a live user record on every request, so a
  deactivated/rejected account loses access immediately.
- Role-based middleware (`middleware/role.js`) protects every admin-only route.
- Newly registered accounts always start as `role: "user"`, `status: "pending"` —
  only an existing admin can promote or approve accounts.
<!-- sunehamariam0@gmail.com
Suneha@123 -->



# Rename this file to .env and fill in your own values

# MongoDB Atlas connection string
# Example: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart-complaint-db?retryWrites=true&w=majority
MONGO_URI="mongodb://rehanagill260_db_user:5dQZALQD4N7zt390@ac-bfpjrms-shard-00-00.cd1cwb4.mongodb.net:27017,ac-bfpjrms-shard-00-01.cd1cwb4.mongodb.net:27017,ac-bfpjrms-shard-00-02.cd1cwb4.mongodb.net:27017/?ssl=true&replicaSet=atlas-g8sl7b-shard-0&authSource=admin&appName=Cluster0"

# Port the backend server runs on
PORT=5000

# Secret used to sign JWT tokens - use a long random string in production
JWT_SECRET=SECRET123
JWT_EXPIRES_IN=7d

# Initial admin account created by the seed script (npm run seed:admin)
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@institution.edu
ADMIN_PASSWORD=ChangeThisPassword123!



