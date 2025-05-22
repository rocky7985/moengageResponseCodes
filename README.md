# 🐶 HTTP Response Code Lists App

This is a full-stack application. The application allows users to filter, save, edit, and delete HTTP response code lists with accompanying images from [https://http.dog](https://http.dog).

## 📌 Features

- User Authentication (Login/Signup) using JWT
- Filter response codes using exact values or wildcard patterns like `2xx`, `20x`, etc.
- Display corresponding dog images for each code
- Save filtered lists with names and timestamps
- View saved lists
- Edit and delete saved lists
- Integrated with WordPress backend via REST APIs

## 📱 Frontend

- Built with **Angular + Ionic**
- Responsive and mobile-friendly UI

## ⚙️ Backend

- Built as a custom **WordPress plugin**
- Implements REST API endpoints: `signup`, `login`, `save_filtered_list`, `edit_saved_list`, `delete_list`, etc.
- Connects to **public MySQL database**

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/5b57cb52-2585-45fd-8eaf-07df8f563df7)

## 🛠️ Setup Instructions

### 🔧 Prerequisites

- Node.js + Angular CLI + Ionic
- WordPress with custom plugin support
- MySQL database

### 🚀 Frontend (Angular/Ionic)

```bash
npm install
ionic serve   # for local development
