# 🛒 SAAS Multi-Vendor E-Commerce Platform

A **SAAS Multi-Vendor E-Commerce Platform** built with a **microservices architecture** to simulate a **large-scale, high-traffic, and scalable e-commerce system**.
This project is developed as an **advanced backend engineering & system design portfolio project**, focusing on real-world patterns used in production systems.

---

## 🚀 Tech Stack

### Backend & Infrastructure

- **Node.js + TypeScript**
- **Express.js** (REST API)
- **Nx Monorepo** (Microservices management)
- **Prisma ORM**
- **MongoDB** (Main database)
- **Redis** (OTP, rate limiting, caching)
- **Apache Kafka** (Event-driven communication)
- **Docker** (Containerization)

### Frontend

- **Next.js** (In Progress)

### Dev & Tooling

- Swagger / OpenAPI
- JWT Authentication
- Centralized Error Handling
- Email Service (OTP Verification)
- Rate Limiting & Security Middleware

---

## 🧩 Architecture Overview

The system is built using a **Microservices Architecture** pattern:

- **API Gateway** as the single entry point
- Independent services (Auth, Product, User, etc.)
- **Event-driven communication** using **Kafka**
- Shared internal packages (Prisma, Error Handler, Utils) managed via **Nx**

```
Client → API Gateway → Microservices → MongoDB / Redis / Kafka
```

This approach improves **scalability, maintainability, and fault isolation**.

---

## 🔐 Auth Service (Implemented)

## 🔐 Auth & Core Features

- User Registration
- Login & JWT Authentication
- Refresh Token Rotation (Security Best Practice)
- Email OTP Verification
- OTP Cooldown & Expiration
- OTP Rate Limiting using Redis
- Spam Protection for OTP Requests
- Role-Based Access Control (User / Seller)
- AI-Powered Image Enhancement for Product Upload
  - Automatic image quality enhancement
  - Optimized for e-commerce product images
  - external store implementation with Imagekit
- Centralized Error Handling (Reusable Package)
- Swagger / OpenAPI Documentation

### OTP Verification Flow

1. User registers
2. System checks OTP rate limits & cooldown (Redis)
3. OTP is generated and sent via email
4. OTP is temporarily stored in Redis
5. User submits OTP for verification
6. Account is activated after successful verification

---

## 🛍️ Product Service (Implemented)

### Features

- Product Creation (Seller Only)
- Slug Uniqueness Validation
- Rich Text Product Description
- Product Images Handling
- Product Categories & Subcategories
- Product Variants (Colors & Sizes)
- Stock & Pricing Management
- Discount Code Support
- Custom Specifications
- Custom Properties (Dynamic Attributes)

### Technical Highlights

- Prisma relational handling with MongoDB
- Strict schema validation
- Defensive payload validation
- Image relation creation using Prisma nested writes
- Clean separation between request validation and persistence logic

---

## ⚙️ Features Roadmap

- [x] User Registration
- [x] Login & JWT Authentication
- [x] Email OTP Verification
- [x] Redis Rate Limiting
- [x] Shared Error Handler Package
- [x] Role-Based Access Control (User / Seller)
- [x] Product Service (Create Product)
- [ ] Product Listing & Filtering
- [ ] Order Service
- [ ] Kafka Event Producers & Consumers
- [ ] Payment Integration
- [ ] Seller & Admin Dashboard (Frontend)

---

## 🧠 What I Learned

Through this project, I gained hands-on experience with:

- Designing **scalable microservices architectures**
- Managing **Nx Monorepo** with shared packages
- Implementing **Redis-based rate limiting & caching**
- Handling **event-driven systems** using Kafka
- Advanced **Prisma + MongoDB** schema modeling
- Strict backend validation & error handling
- Real-world product creation workflows
- Building secure **authentication systems** with OTP

---

## 📦 Monorepo Structure (Simplified)

```
apps/
 ├─ api-gateway
 ├─ auth-service
 ├─ product-service
packages/
 ├─ prisma
 ├─ error-handler
 ├─ components
 ├─ middleware
 ├─ imageKit
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
