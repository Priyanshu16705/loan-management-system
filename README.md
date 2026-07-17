# LoanEase — Loan Management System (MERN)

A complete, production-ready Loan Management System built with MongoDB, Express, React, and Node.js. Customers can apply for loans, upload documents, track approval status, and make repayments. Admins can review applications, approve/reject loans, manage customers, and view reports.

**Live Demo:** https://loan-management-system-six-zeta.vercel.app/

## Features

- JWT authentication with role-based access control (customer / admin)
- Loan application with document upload (Aadhaar, PAN, salary slip, bank statement)
- Automatic EMI calculation using the standard amortization formula
- Loan lifecycle tracking: pending → approved/rejected → disbursed → closed
- Repayment tracking with receipt numbers
- Admin dashboard with stats, approvals, customer management, and monthly reports (charts via Recharts)
- Email notifications on registration, loan approval, and rejection (Nodemailer)
- Security: Helmet, CORS, rate limiting, bcrypt password hashing, input validation

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, React Router, Axios, Recharts, vanilla CSS design system |
| Backend  | Node.js, Express, Mongoose |
| Database | MongoDB (Atlas recommended) |
| Auth     | JWT + bcrypt |
| Uploads  | Multer |
| Email    | Nodemailer |

## Project structure

```
lms/
├── backend/
│   ├── controllers/      # Route handler logic
│   ├── routes/           # Express routers
│   ├── middleware/       # auth.js (JWT + role guard), upload.js (Multer)
│   ├── models/           # Mongoose schemas: User, Loan, Payment, Document, Notification
│   ├── config/db.js      # MongoDB connection
│   ├── utils/            # JWT helper, email sender, email templates
│   ├── uploads/          # Uploaded documents (gitignored, kept via .gitkeep)
│   ├── app.js             # Express app (middleware + routes)
│   └── server.js          # Entry point
│
└── frontend/
    └── src/
        ├── components/   # common (Navbar, Sidebar, layout), customer, admin
        ├── pages/         # auth/, customer/, admin/
        ├── context/       # AuthContext (login/register/logout state)
        ├── services/      # Axios calls grouped by domain
        └── utils/         # formatCurrency, formatDate
```

## Local setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/lms
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **MongoDB**: create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), add a database user, and whitelist your IP (or `0.0.0.0/0` for development). Copy the connection string into `MONGO_URI`.
>
> **Email**: with Gmail, enable 2-Step Verification, then create an [App Password](https://myaccount.google.com/apppasswords) and use that as `EMAIL_PASS`. Email sending is wrapped in try/catch everywhere, so the app works fine even without valid email credentials — emails just won't be sent.

Run it:

```bash
npm run dev    # nodemon, auto-restarts
# or
npm start
```

Backend runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 3. Create an admin user

There's no public "become admin" button (by design). After registering a normal account, promote it to admin directly in MongoDB:

- **MongoDB Atlas UI**: Browse Collections → `users` → find your user → edit `role` field from `"customer"` to `"admin"`.
- **mongosh**:
  ```js
  use lms
  db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
  ```

Log out and back in — you'll land on `/admin` instead of `/dashboard`.

## Deployment

### Backend → Render

1. Push this repo to GitHub (see below).
2. Go to [render.com](https://render.com) → New → Web Service → connect your repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install`. Start command: `npm start`.
5. Add environment variables from `.env` (Render's dashboard → Environment) — `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `CLIENT_URL` (set this to your deployed frontend URL once you have it).
6. Deploy. Render gives you a URL like `https://lms-backend.onrender.com`.

A `render.yaml` is included in `backend/` if you prefer Render's "Infrastructure as Code" flow (Render Blueprint).

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import your repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Add environment variable `VITE_API_URL` = `https://lms-backend.onrender.com/api` (your Render backend URL + `/api`).
5. Deploy. Vercel gives you a URL like `https://lms-frontend.vercel.app`.
6. Go back to Render and update `CLIENT_URL` to this Vercel URL, then redeploy the backend (so CORS allows it).

### MongoDB → Atlas

Already covered above. Use the same `MONGO_URI` in both your local `.env` and Render's environment variables.

## Pushing to GitHub

```bash
cd lms
git init
git add .
git commit -m "Initial commit: complete LMS (MERN)"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## API reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in |
| POST | `/api/auth/forgot-password` | — | Request reset email |
| POST | `/api/auth/reset-password/:token` | — | Reset password |
| GET | `/api/users/profile` | customer | Get own profile |
| PUT | `/api/users/profile` | customer | Update profile |
| PUT | `/api/users/change-password` | customer | Change password |
| GET | `/api/users/dashboard-stats` | customer | Dashboard summary |
| POST | `/api/loans/apply` | customer | Apply for loan (multipart, `documents` field) |
| GET | `/api/loans` | customer | List own loans (`?status=`) |
| GET | `/api/loans/:id` | customer | Loan detail + documents |
| POST | `/api/loans/calculate-emi` | customer | EMI preview |
| POST | `/api/payments` | customer | Make a repayment |
| GET | `/api/payments` | customer | Own payment history |
| GET | `/api/payments/:loanId` | customer | Payments for one loan |
| GET | `/api/admin/dashboard` | admin | Platform stats |
| GET | `/api/admin/loans` | admin | All loans (`?status=&page=&limit=`) |
| PUT | `/api/admin/loans/:id/approve` | admin | Approve loan |
| PUT | `/api/admin/loans/:id/reject` | admin | Reject loan |
| GET | `/api/admin/users` | admin | All customers |
| PUT | `/api/admin/users/:id/block` | admin | Block/unblock a customer |
| GET | `/api/admin/payments` | admin | All payments |
| GET | `/api/admin/reports/monthly` | admin | Monthly collection report |

## Notes & known limitations

- This is a learning/demo project, not audited for production financial use. Don't connect it to real money without a proper security review and a licensed payment gateway integration (Razorpay/Stripe are not wired in — see the original spec's "optional premium features").
- File uploads are stored on local disk (`backend/uploads/`). Render's free tier has an ephemeral filesystem — uploaded files will be lost on redeploy/restart. For real persistence, swap `multer.diskStorage` for a Cloudinary or S3 upload in `backend/middleware/upload.js`.
- Email sending fails silently (try/catch) if SMTP credentials are missing or wrong — the rest of the app keeps working.

## Developer
**Priyanshu kumar**
**GitHub** https://github.com/Priyanshu16705/
