# 🔐 User Authentication & Authorization

**Tech Stack:** Node.js, Express.js, MongoDB, JWT, Passport.js

**Auth Methods:** Local, Google OAuth, Facebook OAuth, 2FA (TOTP)

#### It supports:

-   Email & password authentication
-   Email verification
-   **JWT-based** access & refresh tokens
-   Password reset
-   Two-Factor Authentication (2FA)
-   Google & Facebook OAuth login
-   Secure logout & token invalidation

#### Authentication Flow

###### It supports:

-   User registers with **email, name, password**
-   Verification email sent with verification token
-   User verifies email
-   Access & Refresh tokens are issued
    -   **Access Token **→ 15 minutes
    -   **Refresh Token** → 7 days
-   Access token refreshed using refresh token
-   Secure logout invalidates tokens
-   Optional **2FA** setup using Google Authenticator
-   OAuth login using **Google** or **Facebook**

### Model Documentation

ER Diagram: https://dbdiagram.io/d/User-Authentication-697db78ebd82f5fce232be0a
![Database Schema](docs/schema.png)

### API Documentation

# 🛡️ Auth Routes (`/auth`)

| Method | Endpoint                     | Description                | Auth Required |
| ------ | ---------------------------- | -------------------------- | ------------- |
| POST   | `/register`                  | Register new user          | ❌            |
| POST   | `/login`                     | Login user                 | ❌            |
| POST   | `/resend-verification-email` | Resend email verification  | ❌            |
| GET    | `/verify-email`              | Verify email using token   | ❌            |
| POST   | `/forgot-password`           | Send reset password email  | ❌            |
| POST   | `/reset-password`            | Reset password using token | ❌            |
| POST   | `/refresh`                   | Generate new access token  | ✅            |
| POST   | `/logout`                    | Logout user                | ✅            |

#### 🔎 Google Authentication

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/google`          | Google OAuth login    |
| GET    | `/google/callback` | Google OAuth callback |

---

#### 📘 Facebook Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| GET    | `/facebook`          | Facebook OAuth login    |
| GET    | `/facebook/callback` | Facebook OAuth callback |

---

#### 📲 Two-Factor Authentication (2FA)

| Method | Endpoint               | Description                 | Auth Required |
| ------ | ---------------------- | --------------------------- | ------------- |
| POST   | `/2fa/setup`           | Setup 2FA (generate secret) | ✅            |
| GET    | `/2fa/qr-code/:userId` | Get QR code for 2FA         | ✅            |
| POST   | `/2fa/verify`          | Verify & enable 2FA         | ✅            |
| POST   | `/2fa/disable`         | Disable 2FA                 | ✅            |

---

#👤 User Routes (`/api/user`)

User-specific operations for authenticated users.

### Base Path

### Routes

| Method | Endpoint | Description                | Auth Required |
| ------ | -------- | -------------------------- | ------------- |
| GET    | `/me`    | Get logged-in user profile | ✅            |

---

#🧑‍💼 Admin Routes (`/api/admin`)

Admin-only operations.

### Base Path

### Routes

| Method | Endpoint | Description   | Role  |
| ------ | -------- | ------------- | ----- |
| GET    | `/users` | Get all users | ADMIN |

---
