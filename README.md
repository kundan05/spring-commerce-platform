# Spring Commerce Platform

Enterprise-grade full-stack e-commerce platform. Spring Boot 3.2 + React 19 + MySQL.

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

### Products (`/api/v1/products`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/products` | List products (search, filter, paginate) | No |
| GET | `/products/{id}` | Product details | No |
| GET | `/products/search?query=` | Search products | No |
| POST | `/products` | Create product | ADMIN |
| PUT | `/products/{id}` | Update product | ADMIN |
| DELETE | `/products/{id}` | Delete product | ADMIN |

### Cart (`/api/v1/cart`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/cart` | Get user's cart | USER |
| POST | `/cart/items` | Add item to cart | USER |
| PUT | `/cart/items/{id}` | Update quantity | USER |
| DELETE | `/cart/items/{id}` | Remove item | USER |
| DELETE | `/cart/clear` | Clear cart | USER |

### Orders (`/api/v1/orders`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/orders` | Place order | USER |
| GET | `/orders` | User's order history | USER |
| GET | `/orders/{id}` | Order details | USER |

### Users (`/api/v1/users`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/users/me` | Get profile | USER |
| PUT | `/users/me` | Update profile | USER |
| PUT | `/users/me/password` | Change password | USER |

### Admin (`/api/v1/admin`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/admin/stats` | Dashboard stats | ADMIN |
| GET | `/admin/orders` | All orders | ADMIN |
| PUT | `/admin/orders/{id}/status` | Update order status | ADMIN |

### Payments (`/api/v1/payments`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/payments/create-intent` | Create Stripe PaymentIntent | USER |
| POST | `/payments/confirm` | Confirm payment | USER |

### Webhooks
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/webhooks/stripe` | Stripe event webhooks |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | (required) | Base64-encoded 256-bit secret |
| `JWT_EXPIRATION_MS` | 900000 (15min) | Access token TTL |
| `JWT_REFRESH_EXPIRATION_MS` | 604800000 (7d) | Refresh token TTL |
| `STRIPE_API_KEY` | (required) | Stripe secret key |
| `DB_ROOT_PASSWORD` | root | MySQL root password |

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
