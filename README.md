# 🎤 21 Savage Fan Message Board

 A simple full-stack CRUD message board. Fans post a message with their name, give messages a thumbs up or thumbs down, and delete them. Every action is saved to MongoDB.
 
Built with Node.js, Express, MongoDB, and EJS.
 
🔗 **Live Demo:** [savage-demo-ynbk.onrender.com](https://savage-demo-ynbk.onrender.com)


![21 Savage](public/21savage.jpg)
 

 

 
 
## ✨ Features
 
- **Create**: post a message with your name
- **Read**: every message loads from MongoDB when the page renders
- **Update**: thumbs up adds 1 to a message's score, and thumbs down subtracts 1
- **Delete**: remove a message with the trash icon
- Page refreshes after each action so the list stays up to date

 
## 🔍 How It Works
 
```
Form / icon click ──▶ Express route ──▶ MongoDB "messages" collection ──▶ EJS re-renders the list
```
 
### Routes
 
| Method | Route                | What it does                                  |
| ------ | -------------------- | --------------------------------------------- |
| GET    | `/`                  | Loads all messages and renders `index.ejs`    |
| POST   | `/messages`          | Saves a new message with a score of 0         |
| PUT    | `/messages/thumbUp`  | Adds 1 to the message's score                 |
| PUT    | `/messages/thumbDown`| Subtracts 1 from the message's score          |
| DELETE | `/messages`          | Deletes the message                           |
 
The `PUT` and `DELETE` routes find a message by its `name` and `msg`, which `public/main.js` reads from the page and sends with `fetch()`.
 

 
## 🛠️ Tech Stack
 
- **Node.js** and **Express**
- **MongoDB** (official Node.js driver)
- **EJS** templates
- **Font Awesome** icons
- **dotenv** for environment variables
- **nodemon** for development

 
## 📁 Project Structure
 
```
savage-demo/
├── server.js          # Express app, routes, and MongoDB connection
├── views/
│   └── index.ejs      # Message list and form
├── public/
│   ├── main.js        # Thumbs up, thumbs down, and delete requests
│   ├── styles.css
│   ├── font-awesome.min.css
│   ├── fonts/
│   └── 21savage.jpg
└── package.json
```
 
---
 
## 🚀 Getting Started
 
You need [Node.js](https://nodejs.org/) and a [MongoDB Atlas](https://www.mongodb.com/atlas) database.
 
### 1. Clone and install
 
```bash
git clone https://github.com/kareemahb/savage-demo.git
cd savage-demo
npm install
```
 
### 2. Add your database connection
 
Create a `.env` file in the project root:
 
```
DB_STRING=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
```
 
The app uses a database named `demo` and a collection named `messages`. MongoDB creates both when the first message is saved.
 
### 3. Run it
 
```bash
npm run savage   # starts with nodemon (restarts on file changes)
# or
npm start
```
 
Then open [http://localhost:3000](http://localhost:3000).
 

 
## 💡 What I Learned
 
- Building all four CRUD operations with Express routes
- Connecting to MongoDB with the official driver and `async`/`await`
- Rendering database data on the server with EJS
- Sending `PUT` and `DELETE` requests from the browser with `fetch()`
- Keeping the database connection string in a `.env` file

 
## 👩‍💻 Created By
 
**Kareemah Bahaadur**
[GitHub](https://github.com/kareemahb)
