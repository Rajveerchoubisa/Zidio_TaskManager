# 🚀 Zidio Task Management System

A vibrant, full-featured MERN Stack Task Manager with role-based access, real-time collaboration, comments, and analytics — built for teams to manage tasks visually and efficiently.

---

## 🔧 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based login system
- **Authorization**: Role-based (Admin, Editor, Viewer)

---

## 🌟 Features

### 👥 User Management
- Register & Login
- JWT-secured protected routes
- Role-based permissions (Admin, Editor, Viewer)

### ✅ Task Management
- Create tasks with:
  - Title, Description, Priority, Deadline, Assignee
- Assign to team members
- Kanban-style status: `To Do`, `In Progress`, `Done`
- Edit task status (Admin/Editor only)
- Delete task (Admin or assigned user)

### 💬 Comments
- Add comments per task
- Auto-attached user info

### 📊 Analytics
- Total tasks
- Completed tasks
- Task distribution per user


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Rajveerchoubisa/Zidio_TaskManager.git
cd Zidio_TaskManager
cd backend
npm install
node server.js

cd frontend
npm install
npm run dev


```
## env file
PORT=your port number
MONGO_URI=mongo db url
JWT_SECRET=your_jwt_secret

