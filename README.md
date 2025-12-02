# Personal Financial Management System
# Monorepo: React + TypeScript Frontend | Django Backend | MySQL

This repository contains a full-stack application with:

- **Frontend:** React + TypeScript
- **Backend:** Django + Django REST Framework
- **Database:** MySQL
- **Authentication:** JWT (`createSession` API)
- **API docs:** Swagger
- **Dockerized** for local development with hot reload
- **CI/CD:** GitHub Actions (lint/test/build)

---

## **1. Prerequisites**

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Mac/Windows/Linux)
- Git
- (Optional) Node.js & npm if running frontend outside Docker

---

## **2. Clone the repository**

```bash
git clone <your-repo-url>
cd <repo-root>


Steps:
1. Install Docker Desktop
2. clone the repository from soundarya branch
3. give "npm install" inside frontend folder
4. Give "npm install bootstrap-icons", "npm install validator @types/validator" inside frontend folder
5. Come back to the main folder and give "docker-compose up --build" - run twice, use control+c to stop.

Information:
1. backend/apps/users/migrations/0001_initial.py - has the migration scripts
2. if frontend/src/generated/api... needs to be updated then give "npm run generate-api"
3. .env file has db connection information
4. docker-compose.yml has all port details and services available.
5. In MySQLWorkbench, create a connection, give username, password, db schema mentioned in the .env file / docker-compose.yml.
6. After running "docker-compose up --build" 2 times, the database table will be created in the mysqlworkbench. Run twice only for the 1st time.
7. If you insert any record in the database then have that file eported for backup.