require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// Render and other hosts set PORT. Locally it falls back to 3000.
const PORT = process.env.PORT || 3000;
const url = process.env.DB_STRING;
const dbName = "demo";
const collectionName = "helloKittyMessages";

const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 280;

// Topics fans can post under. The id is saved with each message.
const TOPICS = [
  { id: "memories", label: "Memories", emoji: "💭" },
  { id: "merch", label: "Merch Finds", emoji: "🛍️" },
  { id: "collecting", label: "Collecting", emoji: "🧸" },
  { id: "art", label: "Art & Crafts", emoji: "🎨" },
  { id: "cafes", label: "Cafés & Events", emoji: "🍰" },
  { id: "friends", label: "Sanrio Friends", emoji: "🌸" },
];

const topicById = Object.fromEntries(TOPICS.map((topic) => [topic.id, topic]));

// "newest" uses _id because MongoDB ids start with the time they were created
const SORT_OPTIONS = {
  newest: { _id: -1 },
  top: { thumbUp: -1, _id: -1 },
};

let messages;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Turns an id from the URL into a MongoDB ObjectId, or null if it isn't valid
const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// "3 min ago", "2 days ago", etc. Used by the EJS template.
const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["min", 60],
  ];

  for (const [unit, size] of units) {
    const amount = Math.floor(seconds / size);
    if (amount >= 1) return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
  }

  return "just now";
};

app.get("/", async (req, res) => {
  const sort = SORT_OPTIONS[req.query.sort] ? req.query.sort : "newest";
  const topic = topicById[req.query.topic] ? req.query.topic : "";

  // Builds links that keep the current sort and topic, e.g. /?sort=top&topic=merch
  const link = (changes) => {
    const params = new URLSearchParams({ sort, topic, ...changes });
    if (!params.get("topic")) params.delete("topic");
    if (params.get("sort") === "newest") params.delete("sort");

    const query = params.toString();
    return query ? `/?${query}` : "/";
  };

  try {
    const filter = topic ? { topic } : {};
    const result = await messages
      .find(filter)
      .sort(SORT_OPTIONS[sort])
      .toArray();

    res.render("index.ejs", {
      messages: result,
      sort,
      topic,
      topics: TOPICS,
      topicById,
      link,
      error: req.query.error,
      maxName: MAX_NAME_LENGTH,
      maxMessage: MAX_MESSAGE_LENGTH,
      timeAgo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading messages");
  }
});

app.post("/messages", async (req, res) => {
  const name = String(req.body.name ?? "")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
  const msg = String(req.body.msg ?? "")
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);
  const topic = topicById[req.body.topic] ? req.body.topic : TOPICS[0].id;

  if (!name || !msg) {
    return res.redirect("/?error=empty");
  }

  try {
    await messages.insertOne({ name, msg, topic, thumbUp: 0 });
    console.log("saved to database");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving message");
  }
});

// Finds the message by its id, so two messages with the same text can't get mixed up
app.put("/messages/:id/vote", async (req, res) => {
  const id = toObjectId(req.params.id);
  const change = { up: 1, down: -1 }[req.body.direction];

  if (!id || !change) {
    return res.status(400).json({ error: "Invalid message or vote." });
  }

  try {
    const result = await messages.findOneAndUpdate(
      { _id: id },
      { $inc: { thumbUp: change } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.json({ thumbUp: result.thumbUp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not save your vote." });
  }
});

app.delete("/messages/:id", async (req, res) => {
  const id = toObjectId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid message." });
  }

  try {
    const result = await messages.findOneAndDelete({ _id: id });

    if (!result) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.json({ message: "Message deleted!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not delete the message." });
  }
});

const start = async () => {
  if (!url) {
    throw new Error("DB_STRING is missing. Add it to your .env file.");
  }

  const client = await MongoClient.connect(url);
  messages = client.db(dbName).collection(collectionName);
  console.log(`Connected to ${dbName}!`);

  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
};

start().catch((err) =>
  console.log("Could not connect to MongoDB:", err.message),
);
