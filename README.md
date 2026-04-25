##🌾 AgriPower – Smart Power Distribution System

AgriPower is a full-stack web application designed to improve electricity distribution for farmers. 
It provides real-time tracking of power schedules, voltage, and usage, along with an admin panel to manage and monitor the system efficiently.

🚀 Features :-

👨‍🌾 Farmer
* Register and login
* View power schedule based on zone
* Track electricity usage
* Check voltage updates
* View announcements
* Raise complaints and view replies

👨‍💼 Admin
* Login with admin access
* Set power schedules for zones
* Add voltage updates
* Add electricity usage data
* View and reply to complaints
* Post announcements
  
🛠️ Tech Stack

* **Frontend**: HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Deployment:**
  * Backend → Render
  * Frontend → Vercel

---

## 📂 Project Structure

```
agriculture/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── admin.html
│
├── server.js
├── package.json
```

---

## ⚙️ Setup Instructions (Local)

1. Clone the repository

```
git clone https://github.com/your-username/agriculture.git
cd agriculture
```

2. Install dependencies

```
npm install
```

3. Start MongoDB locally

4. Run the server

```
node server.js
```

5. Open in browser:

```
http://localhost:3000
```

---

## 🌐 Deployment

### Backend (Render)

* Connected GitHub repository
* Added environment variables (MongoDB URI)
* Auto deploy enabled

### Frontend

* Hosted using static hosting
* Connected with backend API using Render URL

---

## 🔑 Default Admin Access

* Admin is created during registration
* Requires:

  * Name: `admin`
  * Phone: `9999999999`
  * Passkey: `5463`

---

## 📸 Screenshots

(Add screenshots here if required)

---

## ⚠️ Note

This project is built for academic purposes. Security features like authentication and encryption can be improved in future versions.

---

## 💡 Future Improvements

* Secure authentication (JWT)
* Role-based authorization
* Better UI/UX
* Real-time updates using sockets
* Mobile responsiveness

---

## 👩‍💻 Author

Developed as part of a team project submission.

---

## ⭐ Acknowledgement

Special thanks to mentors and team members for guidance and support.
