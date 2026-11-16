# 🌸 Hello Kitty Fan Board

An unofficial full-stack message board for Hello Kitty fans. Post a message under a topic like Merch Finds or Café & Events, show love for other fans' posts, filter by topic, and sort by newest or most loved. Every action is saved to MongoDB.

Built with Node.js, Express, MongoDB, and EJS.

🔗 **Live Demo:** [savage-demo-ynbk.onrender.com](https://savage-demo-ynbk.onrender.com)

![alt text](image.png)

## ✨ Features

- **Create**: post a message with your name and a topic
- **Read**: messages load from MongoDB and show how long ago they were posted ("5 mins ago")
- **Update**: ❤️ adds 1 to a message's score and 👎 subtracts 1. Each browser can vote once per message, and the score updates without reloading the page.
- **Delete**: the trash button asks "Sure?" first, then the message fades out without reloading the page
- **Topics**: Memories, Merch Finds, Collecting, Art & Crafts, Cafés & Events, and Sanrio Friends
- **Filter by topic** and **sort** by Newest or Most loved. The two work together, for example `/?sort=top&topic=merch`.
- **Character counter** on the message box (280 max)
- **Validation**: empty names or messages show a friendly error, and the server trims and limits every field
- **Pastel theme** with an original icon set (sparkles, hearts, shells, flowers, palms) and sticker-style cards
- **Responsive design** for phones

## 🎨 Design

| Color           | Hex       |
| --------------- | --------- |
| Butter          | `#FDF7CF` |
| Lemon           | `#FEF0A6` |
| Sky             | `#79BACE` |
| Blush           | `#FEDEE9` |
| Pink            | `#F7B5CB` |
| Mint            | `#D1F0F0` |
| Cherry (accent) | `#E5395A` |

Fonts: [Pacifico](https://fonts.google.com/specimen/Pacifico) for titles and [Nunito](https://fonts.google.com/specimen/Nunito) for body text.

## 🔍 How It Works

```
Form / button click ──▶ Express route ──▶ MongoDB "helloKittyMessages" collection ──▶ EJS renders the board
```

### Routes

| Method | Route                | What it does                                                          |
| ------ | -------------------- | --------------------------------------------------------------------- |
| GET    | `/?sort=&topic=`     | Loads messages (optionally filtered by topic) and renders `index.ejs` |
| POST   | `/messages`          | Saves a new message with its topic and a score of 0                   |
| PUT    | `/messages/:id/vote` | Adds or subtracts 1, based on `{ "direction": "up" }` or `"down"`     |
| DELETE | `/messages/:id`      | Deletes the message                                                   |

The `PUT` and `DELETE` routes find a message by its MongoDB `_id`, so two messages with the same name and text can't get mixed up.

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
├── server.js          # Express app, routes, topics, and MongoDB connection
├── views/
│   └── index.ejs      # Board layout, post form, topic filters, and message cards
├── public/
│   ├── main.js        # Voting, delete confirmation, toast messages, character counter
│   ├── styles.css     # Pastel theme
│   ├── favicon.svg
│   ├── font-awesome.min.css
│   └── fonts/
└── package.json
```

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

The app uses a database named `demo` and a collection named `helloKittyMessages`. MongoDB creates both when the first message is saved.

### 3. Run it

```bash
npm run savage   # starts with nodemon (restarts on file changes)
# or
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

## 💡 What I Learned

- Building all four CRUD operations with Express routes
- Finding documents by `_id` instead of by their text
- Updating the page with `fetch()` responses instead of reloading
- Filtering and sorting MongoDB queries from URL query parameters
- Validating and limiting user input on the server
- Keeping the database connection string in a `.env` file

## ⚖️ Disclaimer

This is an unofficial fan project. Hello Kitty is a trademark of Sanrio Co., Ltd. This project isn't affiliated with or endorsed by Sanrio.

## 👩‍💻 Created By

**Kareemah Bahaadur**
[GitHub](https://github.com/kareemahb)
