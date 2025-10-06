# Online Fraud Detection Backend (Spring Boot)

This is the backend for the Online Payment Fraud Detection system, built with Spring Boot, Maven, Java 17, and H2 in-memory database.

## Features
- User registration/login (REST API)
- Admin dashboard (user management, blacklist/whitelist)
- Transaction submission and fraud risk scoring
- Device/location tracking
- Analytics endpoints
- REST API for all features

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Data JPA
- Spring Web
- Spring Security (basic auth)
- H2 Database (in-memory)
- Thymeleaf (for admin UI, optional)

## Getting Started

1. **Build and Run**
   ```sh
   cd backend
   mvn spring-boot:run
   ```

2. **API Endpoints**
   - `POST /api/auth/register` — Register new user
   - `POST /api/transactions` — Submit transaction (auth required)
   - `GET /api/transactions` — List user transactions (auth required)
   - `GET /api/transactions/fraudulent` — List all fraudulent transactions (admin)
   - `GET /api/admin/users` — List all users (admin)
   - `POST /api/admin/blacklist/{id}` — Blacklist user (admin)
   - `POST /api/admin/whitelist/{id}` — Whitelist user (admin)

3. **H2 Console**
   - Visit [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
   - JDBC URL: `jdbc:h2:mem:frauddb`

4. **Default Admin**
   - Register a user, then manually set role to `ADMIN` in the database for admin access.

## Notes
- Passwords are hashed with BCrypt.
- For production, replace H2 with a persistent DB and improve security.
