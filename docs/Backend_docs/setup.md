
# 🏛️ Government ERP Backend API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

> A step-by-step guide to setting up and running the Government ERP Backend API on your local machine.

---

## 📋 Prerequisites

Ensure you have the following installed on your system before starting:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or `yarn`
- Database instance (e.g., PostgreSQL, MySQL)

---

## 🚀 Installation Steps

### 1. Install Dependencies
Navigate to the `Backend` folder and install the required packages:

```bash
npm install
```
> ⚠️ **Note:** Make sure your terminal is currently inside the `Backend` directory.

### 2. Environment Configuration
Set up your local environment variables by copying the example file:

```bash
cp .env.example .env
```
> 💡 **Tip:** Open the `.env` file and configure your `DATABASE_URL` and other required secrets.

### 3. Database Setup (Prisma)
First, generate the Prisma Client to type-safe your database queries:

```bash
# Generate Prisma Client
npx prisma generate
# OR
npm run generate
```

Next, push your schema directly to the database to create/update tables:

```bash
# Sync schema with database
npx prisma db push
# OR
npm run db
```

---

## 💻 Running the Application

Choose your preferred environment to start the server:

| Mode | Command | Description |
|:---|:---|:---|
| **Development** | `npm run dev` | Starts the server with auto-reload on file changes. |
| **Production** | `npm start` | Starts the optimized server for production. |

---

## 📚 API Documentation

Once the server is successfully running, you can explore and test all the API endpoints through the interactive Swagger UI interface:

🔗 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## ⚡ Common Commands Cheat Sheet

Here is a quick reference for the most frequently used commands:

```bash
# 1. Install dependencies
npm install

# 2. Regenerate Prisma Client (use after modifying schema.prisma)
npx prisma generate

# 3. Sync schema with database
npx prisma db push

# 4. Start server in development mode
npm run dev
```

---

<p align="center">
  <sub>Government ERP Backend API · Setup Guide</sub>
</p>
