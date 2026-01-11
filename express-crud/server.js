import express from "express"
import users from "./data/user.js";

const app = express();
app.use(express.json());


app.get("/users", (req, res) => {
  let { minAge, maxAge } = req.query;
  let result = users;

  if (minAge) result = result.filter(u => u.age >= +minAge);
  if (maxAge) result = result.filter(u => u.age <= +maxAge);

  res.json(result);
});


app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === +req.params.id);
  if (!user) return res.status(404).json({ error: "User topilmadi" });
  res.json(user);
});


app.post("/users", (req, res) => {
  const { name, age } = req.body;

  if (!name || name.length < 3) return res.status(400).json({ error: "Name min 3 chars" });
  if (age === undefined || age < 0) return res.status(400).json({ error: "Age invalid" });

  const exists = users.find(u => u.name === name);
  if (exists) return res.status(400).json({ error: "User already exists" });

  const newUser = { id: users.length + 1, name, age };
  users.push(newUser);
  res.status(201).json({ message: "Qo‘shildi", user: newUser });
});


app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id === +req.params.id);
  if (!user) return res.status(404).json({ error: "User topilmadi" });

  const { name, age } = req.body;

  if (name && name.length < 3) return res.status(400).json({ error: "Name min 3 chars" });
  if (age !== undefined && age < 0) return res.status(400).json({ error: "Age invalid" });

  if (name) user.name = name;
  if (age !== undefined) user.age = age;

  res.json({ message: "Yangilandi", user });
});


app.delete("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id === +req.params.id);
  if (index === -1) return res.status(404).json({ error: "User topilmadi" });

  const deleted = users.splice(index, 1);
  res.json({ message: "O‘chirildi", user: deleted[0] });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portda ishlamoqda`));
