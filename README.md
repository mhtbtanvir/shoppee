# 🌟 Shoppee – Enterprise-Grade E-Commerce Platform
### 🔗LIVE DEMO
[Live Demo](https://shoppee-psi.vercel.app) | [GitHub Repo](https://github.com/mhtbtanvir/Shoppee)

### 🔗 Backend API
The backend is hosted at: [https://shoppee-sb9u.onrender.com](https://shoppee-sb9u.onrender.com)


> **Admin Panel Access:**  
> **Email:** `mhtbtanvir@gmail.com`  
> **Password:** `123456`

---

## 🚀 Overview
Shoppee is a production-ready, full-stack e-commerce platform built with **React, Next.js, Node.js, and MongoDB/PostgreSQL**.  
It features enterprise-level authentication, fast client-side navigation, and a robust admin dashboard with analytics.  
Designed with scalability, responsive UI, and real-world problem-solving in mind, including session management, OTP verification, and role-based access control.

---

## ✨ Key Features

<details>
<summary>🔐 Authentication & Security</summary>

- OTP verification for user registration via **Nodemailer**  
- JWT stored in **HttpOnly cookies & headers**  
- Redis-powered **session & OTP caching**  
- Role-based access control for **users and admins**  
</details>

<details>
<summary>🛍️ User Experience</summary>

- Product browsing with **filters** (category, size, color, brand)  
- Wishlist, likes, and **product reviews**  
- Smart search with **live suggestions**  
- Cart with **real-time totals**  
- Order history with **downloadable invoices**  
</details>

<details>
<summary>👩‍💼 Admin Panel</summary>

- Product **CRUD operations** with multiple images and dynamic options  
- Order management and **status tracking**  
- **Real-time sales analytics dashboard**  
</details>

<details>
<summary>🎨 UI/UX Enhancements</summary>

- **Loading & Error Handling:** Smooth animations and clear messages  
- **Product Grid:** Responsive layout with hover effects  
- **Pagination:** Easy navigation for large catalogs  
- **Interactive Actions:** Like/unlike products and other UI interactions  
- **Fast Navigation:** React Router DOM for reload-free client-side routing  
</details>

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Tools & Services |
|----------|--------|---------|-----------------|
| React, Next.js, Redux Toolkit, TailwindCSS, React Router DOM, Axios | Node.js, Express.js | MongoDB, PostgreSQL | Redis, JWT, Nodemailer |

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)  
- MongoDB instance  
- Redis server  

### Installation
```bash
# Clone the repo
git clone https://github.com/mhtbtanvir/Shoppee.git
cd Shoppee

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Environment Variables
Create a `.env` file in the **server** folder:
```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
REDIS_URL=<your_redis_url>
```

### Running the App
```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```

Access locally at [http://localhost:5173](http://localhost:5173) or visit the live demo at [https://shoppee-psi.vercel.app](https://shoppee-psi.vercel.app).

---

## 🎯 Usage
- Browse products, add to cart, leave reviews, like products, and manage wishlist  
- Admins can manage products, orders, and view analytics via admin dashboard  

---

## 📌 License
MIT License

---

**Shoppee** showcases full-stack development skills, enterprise-level authentication, scalable architecture, and a modern, responsive UI.
