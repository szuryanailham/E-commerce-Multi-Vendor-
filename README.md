# 🛒 SAAS E-Commerce Multi Vendor Platform

Sebuah **project SAAS E-Commerce Multi Vendor** yang dibangun dengan **arsitektur microservices** untuk mensimulasikan sistem e-commerce skala besar (high traffic & scalable). Project ini saya kerjakan sebagai **latihan advanced backend engineering**, system design, dan distributed system.

---

## 🚀 Tech Stack

### Backend & Infrastructure

- **Node.js + TypeScript**
- **Express.js** (REST API)
- **Nx Monorepo** (microservices management)
- **Prisma ORM**
- **PostgreSQL** (main database)
- **Redis** (OTP, rate limit, caching)
- **Apache Kafka** (event-driven communication)
- **Docker** (containerization)

### Frontend

- **Next.js** (planned / in progress)

### Dev & Tooling

- Swagger / OpenAPI
- JWT Authentication
- Email Service (OTP Verification)
- Rate Limiting & Security Middleware

---

## 🧩 Architecture Overview

Project ini menggunakan **Microservice Architecture** dengan pendekatan:

- **API Gateway** sebagai entry point
- Setiap service berdiri sendiri (Auth, User, Order, Product, dll)
- Komunikasi antar service menggunakan **Kafka (event-driven)**
- Shared packages (Prisma, Error Handler, Utils) di-manage oleh **Nx**

```
Client → API Gateway → Microservices → Database / Redis / Kafka
```

---

## 🔐 Auth Service (Current Focus)

Fitur yang sudah / sedang dikembangkan:

- User Registration
- Email OTP Verification
- OTP Rate Limiting (Redis)
- OTP Cooldown & Spam Protection
- Centralized Error Handling
- Swagger API Documentation

### OTP Flow

1. User register
2. Sistem cek rate limit & cooldown
3. OTP dikirim via email
4. OTP disimpan sementara di Redis
5. User verifikasi OTP

---

## ⚙️ Features (Ongoing)

- [x] User Registration
- [x] OTP Email Verification
- [x] Redis Rate Limit
- [x] Error Handler Package
- [ ] Login & JWT Authentication
- [ ] Role-based Access (User / Seller / Admin)
- [ ] Product & Order Service
- [ ] Kafka Event Handling
- [ ] Payment Integration
- [ ] Frontend Dashboard

---

## 🧠 What I Learned

Project ini melatih saya dalam:

- Merancang **scalable backend architecture**
- Mengelola **Nx Monorepo** untuk banyak service
- Handling **1000+ request scenario** dengan Redis
- Event-driven architecture dengan Kafka
- Clean error handling & validation
- Best practice Express + TypeScript

---

## 📦 Monorepo Structure (Simplified)

```
apps/
 ├─ api-gateway
 ├─ auth-service
packages/
 ├─ prisma
 ├─ error-handler
 ├─ shared-utils
```

---

## 📄 API Documentation

Swagger tersedia di masing-masing service:

```
http://localhost:PORT/api-docs
```

---

## 👨‍💻 Author

**Ilham Suryana**
Backend Developer | Fullstack Engineer

> Project ini bersifat **learning & portfolio project** untuk memperdalam system design dan backend engineering.

---

⭐ Jika project ini menarik atau bermanfaat, silakan beri star di repository ini!
