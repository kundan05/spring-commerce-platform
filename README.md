# Spring Commerce Platform

Enterprise-grade full-stack e-commerce platform. Spring Boot 3.2 + React 19 + MySQL.
<img width="1853" height="1005" alt="image" src="https://github.com/user-attachments/assets/67e501de-e7fc-438b-8145-30a61cbfa04b" />


## Tech Stack

**Backend:** Java 17, Spring Boot 3.2.2, Spring Security (JWT), Spring Data JPA, Flyway, MySQL 8.0, Stripe, Swagger/OpenAPI

**Frontend:** React 19, Vite, TailwindCSS 4, Redux Toolkit, React Router 7, Axios, React Hook Form

**CI/CD:** GitHub Actions

## Quick Start

### Prerequisites
- Java 17+, Node 20+, MySQL 8.0+

### Backend
```bash
cd spring-commerce
# Set env vars (or use defaults - NOT for production)
export JWT_SECRET=your-base64-encoded-256bit-secret
export STRIPE_API_KEY=sk_test_...
# Run
mvn spring-boot:run
```

### Frontend
```bash
cd spring-commerce-ui
npm install
npm run dev
```

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────┐
│  React SPA  │────▶│ Spring Boot  │────▶│  MySQL  │
│  (Vite)     │     │  REST API    │     │         │
└─────────────┘     └──────────────┘     └─────────┘
       │                    │
       │              ┌─────┴──────┐
       │              │  Stripe    │
       │              │  Payment   │
       │              └────────────┘
```

## API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/login` | Login (email + password) | No |
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/refresh` | Refresh JWT token | No |



## Security

- JWT access tokens (15min) + refresh tokens (7 days) with rotation
- BCrypt password hashing
- CORS whitelist for frontend origins
- Content Security Policy headers
- Role-based access (USER / ADMIN) via `@PreAuthorize`
- Input validation on all DTOs
- Global exception handler (no stack traces exposed)

## Features

- Product search, filter by category/price, sort
- Shopping cart (guest localStorage + authenticated server)
- Order management with status tracking
- User profile with password change
- Admin dashboard with sales stats
- Stripe payment integration
- Stripe webhook for async payment confirmation
- Database migrations via Flyway
- Caching for product queries
- Lazy-loaded React routes
- Token refresh with retry queue for concurrent 401s
