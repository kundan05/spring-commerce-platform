# Spring Commerce Platform

A robust, full-stack e-commerce application built with Spring Boot and React. This platform provides a comprehensive solution for managing products, orders, shopping carts, and user authentication.

## 🚀 Tech Stack

### Backend
-   **Language**: Java 17
-   **Framework**: Spring Boot 3.2.2
-   **Database**: MySQL 8.0
-   **ORM**: Spring Data JPA / Hibernate
-   **Security**: Spring Security with JWT Authentication
-   **Build Tool**: Maven
-   **Database Migration**: Flyway
-   **API Documentation**: SpringDoc OpenAPI (Swagger UI)

### Frontend
-   **Framework**: React 19
-   **Build Tool**: Vite
-   **Styling**: TailwindCSS
-   **State/Routing**: React Router DOM, React Hook Form
-   **HTTP Client**: Axios

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
-   **Java JDK 17** or higher
-   **Node.js** (v18 or higher) and **npm**
-   **MySQL Server** (v8.0 or higher)
-   **Git**

## 🛠️ Getting Started

### 1. Database Setup

Create a MySQL database named `ecommerce_db`. You can use the MySQL command line or a GUI tool like Workbench/DBeaver.

```sql
CREATE DATABASE ecommerce_db;
```

### 2. Backend Setup (Spring Boot)

1.  Navigate to the backend directory:
    ```bash
    cd spring-commerce
    ```

2.  Configure database credentials. Open `src/main/resources/application.properties` and update your MySQL username and password if they differ from the defaults:
    ```properties
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```

3.  Build the application:
    ```bash
    mvn clean install
    ```

4.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

The backend server will start at `http://localhost:8080`.

### 3. Frontend Setup (React)

1.  Navigate to the frontend directory (open a new terminal):
    ```bash
    cd spring-commerce-ui
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

The frontend application will be accessible at `http://localhost:5173` (or the port shown in your terminal).

## 📚 API Documentation

Once the backend application is running, you can access the interactive API documentation (Swagger UI) at:

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## 🔑 Default Configuration

-   **Server Port**: `8080`
-   **Database URL**: `jdbc:mysql://localhost:3306/ecommerce_db`
-   **JWT Secret**: Configured in `application.properties` key `app.jwt.secret`.

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
