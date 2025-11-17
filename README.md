# CoreThreads E-Commerce Platform

This is a full-stack e-commerce web application for selling apparel, built with a Spring Boot backend and a React frontend.

## Tech Stack

*   **Frontend**:
    *   React (with Vite)
    *   React Router for navigation
*   **Backend**:
    *   Spring Boot
    *   Spring Data JPA for database interaction
    *   Maven for dependency management
*   **Database**:
    *   MySQL

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Node.js](https://nodejs.org/) (version 18 or newer recommended)
*   Java Development Kit (JDK) (version 17 or newer)
*   [Apache Maven](https://maven.apache.org/download.cgi)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) and a client like [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Getting Started

Follow these steps to get your development environment set up and running.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CSIT340
```

### 2. Backend Setup

The backend is a Spring Boot application located in the `corethreads_backend` directory.

**a. Database Configuration:**

1.  Start your MySQL Server.
2.  Using a MySQL client (like MySQL Workbench), create a new database schema. The application is configured to use the name `dbelectiveg1`.
    ```sql
    CREATE DATABASE dbelectiveg1;
    ```
3.  Open the `corethreads_backend/src/main/resources/application.properties` file.
4.  Update the `spring.datasource.username` and `spring.datasource.password` properties to match your MySQL credentials.

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/dbelectiveg1
    spring.datasource.username=your_mysql_username
    spring.datasource.password=your_mysql_password
    ```

**b. Run the Backend:**

1.  Open a terminal and navigate to the backend directory:
    ```bash
    cd corethreads_backend
    ```
2.  Run the application using the Maven wrapper. This will start the backend server on `http://localhost:8080`.
    *   On Windows (PowerShell):
        ```bash
        .\mvnw.cmd spring-boot:run
        ```
    *   On macOS/Linux:
        ```bash
        ./mvnw spring-boot:run
        ```
    When the application starts for the first time, it will automatically create the necessary tables in your `dbelectiveg1` database.

### 3. Frontend Setup

The frontend is a React application located in the `core-threads-app` directory.

**a. Install Dependencies:**

1.  Open a **new** terminal and navigate to the frontend directory:
    ```bash
    cd core-threads-app
    ```
2.  Install the necessary Node.js packages:
    ```bash
    npm install
    ```

**b. Run the Frontend:**

1.  After the installation is complete, start the Vite development server:
    ```bash
    npm run dev
    ```
2.  The terminal will display a URL (usually `http://localhost:5173`). Open this URL in your web browser to see the application.

## Project Structure

The repository is organized into two main folders:

*   `corethreads_backend/`: Contains the Spring Boot backend application, including all controllers, services, repositories, and entities.
*   `core-threads-app/`: Contains the React frontend application, including all components, pages, and styles.

```