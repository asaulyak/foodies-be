# Foodies BE

## Description

Foodies is the backend part of the Cookbook application. It is a Node.js application using the Express.js framework. The project includes various utilities and libraries to aid development, such as CORS, JWT, Sequelize, and more. The application provides a robust API for managing recipes, user authentication, and other related features.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Setup](#database-setup)
- [Restarting the Database](#restarting-the-database)
- [Scripts](#scripts)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/asaulyak/foodies-be.git
   ```
2. Navigate to the project directory:
   ```bash
   cd foodies-be
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. Create a `.env` file by renaming `.env.example`:

   ```bash
   mv .env.example .env
   ```

2. Start the application:
   ```bash
   npm start
   ```

## Database Setup

To set up the database using Docker Compose, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your machine.
2. Navigate to the project root directory where the `docker-compose.yml` file is located.
3. Run the following command to start the database container:

   ```bash
   docker compose up -d
   ```

4. Your PostgreSQL database will now be running and accessible on `localhost:5432`.

5. Ensure your `.env` file has the following variables set appropriately:

   ```env
   DB_HOST=localhost
   DB_USER=youruser
   DB_PASSWORD=yourpassword
   DB_NAME=yourdatabase
   DB_PORT=5432
   ```

6. You can now run your migrations and seed data as needed using your preferred method.

## Restarting the Database

If you need to restart your database due to any issues or changes, you can do so by following these steps:

1. Navigate to the project root directory where the `docker-compose.yml` file is located.
2. Run the following command to stop and remove the existing containers and associated volumes:

   ```bash
   docker compose down --volumes
   ```

3. Start the database container again:
   ```bash
   docker compose up -d
   ```

This will remove the existing data and restart the database container with a fresh state.

## Scripts

- `start`: Start the production server.
- `dev`: Start the development server using Nodemon for automatic restarts.
- `build`: Run all build related tasks.
- `build-docs`: Bundle the API documentation using Redocly.
- `preview-docs`: Preview the API documentation using Redocly.
- `prepare`: Setup Husky hooks.

## License

This project is licensed under the ISC License.
