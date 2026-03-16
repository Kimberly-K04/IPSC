# Table of Contents

- [Table of Contents](#table-of-contents)
- [IPSC - Inventory Prediction \& Supply Chain](#ipsc---inventory-prediction--supply-chain)
  - [✨ Features](#-features)
  - [🛠️ Tech Stack](#️-tech-stack)
      - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Dev tools](#dev-tools)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Clone the Repository](#1-clone-the-repository)
  - [File Structure](#file-structure)
  - [Setup](#setup)
    - [Backend setup](#backend-setup)
    - [Frontend setup](#frontend-setup)
  - [Enviroment Variables](#enviroment-variables)
    - [PostgreSQL Setup](#postgresql-setup)
    - [Enviroment variables setup(Backend)](#enviroment-variables-setupbackend)
    - [Enviroment variables setup(Frontend)](#enviroment-variables-setupfrontend)
  - [Start Application](#start-application)
  - [Testing the app](#testing-the-app)
  - [Deployment(Render)](#deploymentrender)
    - [Environment Variables on Render](#environment-variables-on-render)
  - [API Overview](#api-overview)
  - [Screenshots of the app](#screenshots-of-the-app)
  - [ERD](#erd)

# IPSC - Inventory Prediction & Supply Chain

Welcome to **IPSC**, a full‑stack web application designed to streamline inventory management, predict demand, and provide actionable insights through interactive dashboards. Built with a modern React frontend and a Flask RESTful API, IPSC enables teams to manage products, track orders and sales, monitor alerts, and visualise key performance metrics.

## ✨ Features

- **User Authentication** – Secure signup/login with hashed passwords and session management.
- **Role‑based Access** – Admin and staff roles control access to sensitive features.
- **Product Management** – View, filter, search, and add products with category and supplier associations.
- **Order & Sales Tracking** – Create new orders, automatically generate linked sales, and see recent transactions.
- **System Alerts** – Receive and manage alerts for low stock or important events; mark as read or delete.
- **Analytics Dashboard** – Interactive charts for revenue trends, top products, customer growth, and sales by category.
- **User‑specific Data** – Every user sees only their own orders and sales (multi‑tenant by design).
- **Dark Mode** – Toggle between light and dark themes (persisted in `localStorage`).

## 🛠️ Tech Stack

#### Frontend

- React
- Formik+ yup
- Recharts
- Material UI
- React Router Dom
  
### Backend

- Flask
- Python
- SqlAlchemy-Serializer

### Database

- PostgresSql
- SqlAlchemy

### Dev tools

- Honcho(Procfile)
- Gunicorn

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Python 3.9+
- Node.js 18+ and npm/npm
- PostgreSQL (local installation or Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ipsc.git
cd ipsc
```

## File Structure

```bash
├── client
│   ├── db.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules
│   ├── package.json
│   ├── npm-lock.yaml
│   ├── public
│   ├── README.md
│   ├── src
│   └── vite.config.js
├── dbdiagram.io.png
├── ipsc.dbml
├── migrations
│   ├── alembic.ini
│   ├── env.py
│   ├── __pycache__
│   ├── README
│   ├── script.py.mako
│   └── versions
├── README.md
├── requirements.txt
└── server
├── app.py
├── config.py
├── models
├── __pycache__
├── routes
├── seed.py
└── services

```

## Setup

### Backend setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Frontend setup

```bash
npm install --prefix client
# or
cd client; npm install
```

## Enviroment Variables

### PostgreSQL Setup

**1. Install PostgreSQL**:  

- Follow the [DigitalOcean guide](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart) for Ubuntu, or use the appropriate installer for your OS.

**2. Start the PostgreSQL service** (if it's not running automatically):

```bash
   sudo systemctl start postgresql   # Linux
   # or
   brew services start postgresql    # macOS
```

**3. Create the database**

- Create a local  database and user adjust depending on your OS

```bash
sudo -u postgres psql -c "CREATE DATABASE ipsc_db;"
```

**4. Ensure the database user and password**

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### Enviroment variables setup(Backend)

- **Create a .env in the root of the project with the following:**

```env
FLASK_APP=server.app
FLASK_RUN_PORT=5020
FLASK_DEBUG=True
FLASK_SQLALCHEMY_DATABASE_URI=postgresql://postgres:postgres@localhost:5432/ipsc_db #for development
FLASK_SQLALCHEMY_TRACK_MODIFICATIONS=False
FLASK_SECRET_KEY=your-secret-key
FLASK_SESSION_PERMANENT=False
```

**Note:** If your PostgreSQL runs on a non‑default port (like 5433), change the port number in the URI accordingly.

**To check the post go to within psql and paste the command
below (simplest)**

```bash
SHOW port;
```

### Enviroment variables setup(Frontend)

**Note:** The Frontend uses a separate enviroment file inside the client folder create this ```.env``` with the following :

```env
VITE_API_BASE=/api
```

- This will tell Vite to use the proxy setup in ```vite.config.js``` for API request to your Flask Backend

**5. Run Database Migrations**

- Migrations are already set up ``migrations/`` folder. Run the following to create all tables:

```bash
flask db upgrade
```

**6. Seed the database**

- To populate the databse with sample users, products,sales,orders,alerts
  
```bash
python -m server.seed
```

- This creates:

  - Random suppliers, products, orders, sales, and alerts using Faker. It also creates  fixed users you can use to log in there names and passwords will be printed to you termianl

## Start Application

- We use Honcho to run both the flask Api  and the Vite dev server concurrently from the project root:

```bash
honcho start -f Procfile
```

- You can also run each service manually on diffrent terimals: 

***Flask service**

```bash
flask run
```

***Vite service**

```bash
cd client; npm run dev
```

## Testing the app

- Log in with one of the seeded users (e.g., ```alice@ipsc.com``` / ``12345678``).

- Explore the dashboard, products, alerts, and analytics pages.

- Try adding a new product or creating an order from the Analytics page.

- Log out and log back in to verify session persistence


## Deployment(Render)

### Environment Variables on Render

In your Render Web Service dashboard, set the following environment variables:

- ``FLASK_SQLALCHEMY_DATABASE_URI`` – Use the External Database URL from your Render PostgreSQL instance.

- ``FLASK_SECRET_KEY`` – A strong random string.

- ``VITE_API_BASE`` – For production, this should be /api/v1 (the backend serves the API under this prefix). Set this in the Environment section so it’s available during the frontend build. After setting up the variable run this to build the react app in you local enviroment to test the build works:
  
```bash
cd client; npm run build
```

- Then run:

```bash
 gunicorn 'server.app:create_app()'
 ```

- Run this before you deploy the App to render

**Render Build Command**

```bash
pip install -r requirements.txt && npm install --prefix client && npm run build --prefix client
```

**Render Start Command**

```bash
gunicorn 'server.app:create_app()'
```

## API Overview
All API endpoints are prefixed with /api/v1 and return JSON in the format {"data": [...]} (for lists) or {"data": {...}} (for single objects). Common endpoints include:

``POST /login`` – Authenticate and set session

``GET /check_session`` – Return current logged‑in user

``DELETE /logout`` – End session

``GET /products`` – List all products (paginated)

``POST /products`` – Create a new product

``GET /products/<id>`` – Retrieve one product

``PATCH /products/<id>`` – Update a product

``DELETE /products/<id>``– Delete a product

``GET /users/me/orders``– Return orders belonging to the logged‑in user

``GET /users/me/sales`` – Return sales linked to the user's orders

- And similarly for /suppliers, /alerts, /sales, /orders.


## Screenshots of the app

![Dashboard](./screenshots/dashbords.png)


![Products](./screenshots/product.png)


![Analytics](./screenshots/analytics.png)


![Alerts](./screenshots/alerts.png)


![Settings](./screenshots/settings.png)


## ERD

- Relationship to Implement
  
![erd_diagram](./dbdiagram.io.png)
