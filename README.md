# 🛒 SAAS Multi-Vendor E-Commerce Platform

A **SAAS Multi-Vendor E-Commerce** project built using **microservices architecture** to simulate a large-scale, high-traffic, and scalable e-commerce system. This project is developed as an **advanced backend engineering and system design learning project**.

---

## 🚀 Tech Stack

### Backend & Infrastructure

- **Node.js + TypeScript**
- **Express.js** (REST API)
- **Nx Monorepo** (Microservices management)
- **Prisma ORM**
- **MONGGO DB** (Main database)
- **Redis** (OTP, rate limiting, caching)
- **Apache Kafka** (Event-driven communication)
- **Docker** (Containerization)

### Frontend

- **Next.js** (Planned / In Progress)

### Dev & Tooling

- Swagger / OpenAPI
- JWT Authentication
- Email Service (OTP Verification)
- Rate Limiting & Security Middleware

---

## 🧩 Architecture Overview

This project uses a **Microservices Architecture** approach with:

- **API Gateway** as the single entry point
- Independent services (Auth, User, Order, Product, etc.)
- Inter-service communication via **Kafka (event-driven)**
- Shared packages (Prisma, Error Handler, Utils) managed using **Nx**

```
Client → API Gateway → Microservices → Database / Redis / Kafka
```

---

## 🔐 Auth Service (Current Focus)

Features that have been implemented or are in progress:

- User Registration
- Email OTP Verification
- OTP Rate Limiting using Redis
- OTP Cooldown & Spam Protection
- Centralized Error Handling
- Swagger API Documentation

### OTP Flow

1. User registration
2. System checks rate limits & cooldown
3. OTP is sent via email
4. OTP is temporarily stored in Redis
5. User verifies OTP

---

## ⚙️ Features Roadmap

- [x] User Registration
- [x] OTP Email Verification
- [x] Redis Rate Limiting
- [x] Shared Error Handler Package
- [x] Login & JWT Authentication
- [x] Role-Based Access Control (User / Seller)
- [ ] Product & Order Services
- [ ] Kafka Event Consumers
- [ ] Payment Integration
- [ ] Frontend Dashboard

---

## 🧠 What I Learned

Through this project, I gained hands-on experience with:

- Designing **scalable backend architectures**
- Managing **Nx Monorepo** with multiple services
- Handling **high request throughput** using Redis
- Implementing **event-driven architecture** with Kafka
- Clean error handling & validation patterns
- Best practices for Express + TypeScript
- Creating Complex Form creating Product

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

Swagger documentation is available per service:

```
http://localhost:PORT/api-docs
```

---

## 👨‍💻 Author

**Ilham Suryana**
Backend Developer | Fullstack Engineer

> This project is a **learning & portfolio project** focused on backend engineering, scalability, and system design.

---

⭐ If you find this project useful or interesting, feel free to give it a star!
