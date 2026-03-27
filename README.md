# 🎬 CineVault - Full-Stack Movie Management System

CineVault is a comprehensive full-stack application designed for movie enthusiasts to manage their personal watchlists. It features a secure authentication system, an interactive analytics dashboard, and advanced search capabilities.

---
## 🚀 Live Demo
- Frontend: https://cine-vault-one.vercel.app
- Backend API: https://cinevault-hek5.onrender.com

---
## Sign in Page
![signin](https://github.com/user-attachments/assets/0f44445a-a393-47a5-b7db-4e17ac683823)

## Sign up Page
![signup](https://github.com/user-attachments/assets/49eb087f-2caf-4708-b29a-2e22b8632d3c)

## Dashboard
![dashboard](https://github.com/user-attachments/assets/0b213f04-7999-4669-865d-c1e20b0aad24)

---

## ✨ Key Features
### 🔐 Secure Authentication
- JWT Implementation: Secure login and signup using JSON Web Tokens.

- Protected & Public Routes: Logic to prevent unauthorized access to the dashboard and redirect logged-in users away from the login page.

- Bcrypt Hashing: Passwords are encrypted before being stored in the database.

### 📊 Analytics Dashboard
- Data Visualization: Interactive Pie Charts for watch progress and Bar Charts for genre distribution using Recharts.

- Real-time Stats: Automatic updates as movies are added or marked as watched.

### 🎬 Advanced Movie Management
- Full CRUD: Add, View, Edit, and Delete movies with ease.

- Multi-Field Search: Powerful search logic that filters through Titles, Descriptions, Genres, and Tags simultaneously.

- Smart Filtering: Filter results by Genre or "Watched" status.

- Pagination: Efficiently handle large datasets with page-based navigation.

- Debounced Input: Optimized search performance using a custom useDebounce hook.

---

## 🛠️ Tech Stack
### Frontend
- React (Vite): Fast and modern UI library.

- Context API: Global state management for user authentication.

- Axios: API communication with Interceptors to automatically attach JWT tokens to requests.

- Recharts: High-performance charting library.

- React Router Dom: Client-side routing.

### Backend (Go)
- Golang: High-performance, concurrent backend engine.

- Gorilla Mux: Flexible HTTP router and dispatcher.

- MongoDB Driver: Official driver for NoSQL data management.

- JWT-Go: Standard-compliant token generation and validation.

- CORS Middleware: Secure cross-origin resource sharing.

### Database
- MongoDB Atlas: Scalable cloud-based NoSQL database.


## 📂 Project Structure
```
├── config/         # Database connection & Env setup
├── controllers/    # Request handlers & Business logic
├── models/         # Database schemas (Structs)
├── routes/         # API endpoint definitions
├── middleware/     # Auth (JWT) & Logging middleware
├── utils/          # Standardized API response wrappers
├── main.go         # Go Server
└── frontend/           # React Frontend Source
    ├── src/
    │   ├── components/ # Reusable UI & Route Guards
    │   ├── context/    # Authentication State
    │   ├── hooks/      # Custom React Hooks
    │   ├── pages/      # Home, Dashboard, Auth pages
    │   ├── services/   # Axios configuration (API.js)
    │   └── App.jsx     # Main Routing logic

```


## ⚙️ Installation & Setup
1. Clone the repository
```
git clone https://github.com/your-username/cine-vault.git
cd cine-vault
```
2. Backend Configuration
Create a .env file in the backend/ directory:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
DB_NAME=movieDB
```

Run the backend:
```
go mod tidy
go run main.go
```

3. Frontend Configuration
Update the baseURL in frontend/src/services/api.js to http://localhost:5000. Then run:
```
npm install
npm run dev
```

---

## 🔗 API Endpoints

### Auth

* `POST /auth/signup`
* `POST /auth/login`

### Movies

* `GET /movies`
* `POST /movies`
* `GET /movies/:id`
* `PUT /movies/:id`
* `DELETE /movies/:id`

### Dashboard

* `GET /dashboard/watch-stats`
* `GET /dashboard/genre-stats`

---

## 🧠 Key Concepts Implemented

* RESTful API design
* Clean architecture (MVC pattern)
* Middleware (Auth, Logging)
* MongoDB Aggregation Pipeline
* JWT Authentication
* Pagination & Filtering
* React Context API (Auth)
* Custom Hooks (Debounce ready)

---

### 🤝 Contribution
Contributions are welcome! If you have a feature request or found a bug, please open an issue or submit a pull request.

### ⭐ If you like this project
Give it a star ⭐ on GitHub!

Developed with ❤️ by  [@Yash Kumar](https://github.com/yashk9293)
