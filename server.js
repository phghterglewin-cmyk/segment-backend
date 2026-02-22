const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ===== Fake DB (пока без Mongo) ===== */

let users = {};

let gifts = [
  { id: 1, name: "Star Gift", price: 1 },
  { id: 2, name: "Diamond Gift", price: 3 },
  { id: 3, name: "Royal Crown", price: 5 },
  { id: 4, name: "Rocket Gift", price: 2 }
];

/* ===== Login ===== */

app.post("/login", (req, res) => {
  const { id, username } = req.body;

  if (!users[id]) {
    users[id] = {
      id,
      username,
      balance: 10, // стартовый баланс для теста
      inventory: []
    };
  }

  res.json(users[id]);
});

/* ===== Get Gifts ===== */

app.get("/gifts", (req, res) => {
  res.json(gifts);
});

/* ===== Buy Gift ===== */

app.post("/buy", (req, res) => {
  const { userId, giftId } = req.body;

  const user = users[userId];
  const gift = gifts.find(g => g.id === giftId);

  if (!user || !gift)
    return res.status(400).json({ error: "Invalid data" });

  if (user.balance < gift.price)
    return res.status(400).json({ error: "Not enough balance" });

  user.balance -= gift.price;
  user.inventory.push(gift);

  res.json(user);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
