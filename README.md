📈 Stock Portfolio Tracker

A full-stack Node.js application that allows users to securely register, log in, and track their stock holdings. The backend is built using Express.js, PostgreSQL, JWT-based authentication, and bcrypt for secure password storage.

🚀 Features

🔐 Authentication

User registration with email, username & password
Password hashing using bcryptjs
Login with JWT token generation
Protected routes using JWT middleware

📊 Portfolio Management

Add stocks to a user’s portfolio
Track quantity, buy price, and updated values
Fetch live or cached stock data (depending on your implementation)
View total portfolio value
Update or delete stock entries

🗄 Database

Built using PostgreSQL
Uses pool (pg module) for connection management
Follows modular route/controller structure

🛠 Tech Stack
Category	Technology
Backend	Node.js, Express.js
Database	PostgreSQL (pg)
Authentication	JWT, bcryptjs
Environment	dotenv
Other	REST API, Middleware-based architecture

📁 Project Structure

/project-root
 ├── db.js
 ├── server.js / index.js
 ├── routes/
 │     ├── auth.js
 │     ├── portfolio.js
 ├── controllers/ (optional based on your setup)
 ├── middleware/
 │     ├── authMiddleware.js
 ├── package.json
 ├── .env
 ├── .gitignore
 └── README.md

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2️⃣ Install Dependencies
npm install

3️⃣ Create Environment Variables

Create a .env file in the root directory:

PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/yourdb
JWT_SECRET=your_jwt_secret_key

4️⃣ Start the Server
Development:
npm run dev

Production:
npm start

📌 API Endpoints
Auth Routes
Method	| Endpoint	        | Description
POST	| /auth/register	  Register new user
POST	| /auth/login	      Login & get JWT

Portfolio Routes (protected)
Method	| Endpoint	        | Description
GET	    | /portfolio	      Get user portfolio
POST	| /portfolio	      Add stock
PUT	    | /portfolio/:id	  Update stock
DELETE	| /portfolio/:id	  Delete stock

🛡 Security Practices

Passwords hashed with bcryptjs
Tokens signed using JWT_SECRET
.env file excluded using .gitignore
No secrets committed to GitHub

🧪 Future Enhancements

Live stock price integration (Yahoo Finance, AlphaVantage, Finnhub, etc.)
Frontend UI (React, Next.js, Vue, etc.)
Portfolio analytics & charts
Watchlist feature
Email-based 2FA login
Containerization with Docker

🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first so we can discuss what you’d like to modify.

