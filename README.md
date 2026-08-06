# 🔐 Node Auth

A complete **Node.js Authentication & Authorization** system built with **Express.js**, **MongoDB**, and **JWT**, featuring secure authentication, email verification, password recovery, OAuth login, role-based access control, and production-ready security practices.

🌐 **Live Demo:** https://node-auth-2tjc.vercel.app

---

## ✨ Features

- ✅ User Registration
- ✅ User Login
- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ Email Verification
- ✅ Resend Verification Email
- ✅ Forgot Password
- ✅ Reset Password
- ✅ Google OAuth Login
- ✅ Facebook OAuth Login
- ✅ Protected Routes
- ✅ Role-Based Authorization (User/Admin)
- ✅ Admin Dashboard APIs
- ✅ Secure Password Hashing (bcrypt)
- ✅ HTTP-Only Cookies
- ✅ Centralized Error Handling
- ✅ Environment Variable Configuration
- ✅ RESTful API Architecture

---

# 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- Google OAuth 2.0
- Facebook OAuth
- bcrypt

### Email

- Nodemailer

### Validation & Security

- Cookie Parser
- dotenv

---

# 📁 Project Structure

```text
Node-Auth/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── config/
├── public/
├── app.js
├── server.js
└── package.json
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
https://github.com/pavanpadavala2005/nodeAuth

cd nodeAuth
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

EMAIL_USER=your_email
EMAIL_PASS=your_password

CLIENT_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

---

## 4. Run the Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 📌 API Documentation

## Base URL

```
http://localhost:3000
```

or

```
https://node-auth-2tjc.vercel.app
```

---

# Authentication Routes

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Check server health |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/resend-verification-email` | Resend verification email |
| GET | `/auth/verify-email` | Verify email |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/google` | Google OAuth Login |
| GET | `/auth/facebook` | Facebook OAuth Login |

---

# User Routes

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/user/me` | Get logged-in user's profile |

---

# Admin Routes

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/all-users` | Get all users *(Admin Only)* |
| GET | `/admin/me` | Get admin profile |

---

# 🔒 Authentication Flow

```
User Registration
        │
        ▼
Verification Email Sent
        │
        ▼
Verify Email
        │
        ▼
Login
        │
        ▼
Access Token + Refresh Token
        │
        ▼
Protected APIs
```

---

# 🔐 Security Features

- Password hashing using **bcrypt**
- JWT Access & Refresh Tokens
- Email verification before login
- Password reset via secure email link
- HTTP-only cookies
- Role-based authorization
- Environment variables for secrets
- Protected API routes
- Input validation
- Centralized error handling

---

# 🧪 Health Check

```
GET /health
```

Response

```json
{
  "success": true,
}
```

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Pavan Kumar Padavala**

- GitHub: https://github.com/pavanpadavala2005
- LinkedIn: https://linkedin.com/in/pavan-kumar-padavala/

---

⭐ If you found this project useful, don't forget to **star the repository!**
