import { Router } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");
import db from "../config/db.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, requireRole("Administrador"), (req, res) => {
  const users = db.prepare("SELECT id, username, nombre, email, rol, activo, created_at FROM users ORDER BY nombre").all();
  res.json(users);
});

router.get("/:id", authenticateToken, (req, res) => {
  const user = db.prepare("SELECT id, username, nombre, email, rol, activo, created_at FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

router.post("/", authenticateToken, requireRole("Administrador"), (req, res) => {
  const { username, password, nombre, email, rol } = req.body;

  if (!username || !password || !nombre || !rol) {
    return res.status(400).json({ error: "Username, password, nombre y rol son requeridos" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  try {
    const result = db.prepare(
      "INSERT INTO users (username, password, nombre, email, rol) VALUES (?, ?, ?, ?, ?)"
    ).run(username, hashed, nombre, email || null, rol);

    const user = db.prepare("SELECT id, username, nombre, email, rol, activo, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(user);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "El nombre de usuario ya existe" });
    }
    throw err;
  }
});

router.put("/:id", authenticateToken, requireRole("Administrador"), (req, res) => {
  const { username, password, nombre, email, rol, activo } = req.body;
  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Usuario no encontrado" });

  const updates = [];
  const params = [];

  if (username) { updates.push("username = ?"); params.push(username); }
  if (password) { updates.push("password = ?"); params.push(bcrypt.hashSync(password, 10)); }
  if (nombre) { updates.push("nombre = ?"); params.push(nombre); }
  if (email !== undefined) { updates.push("email = ?"); params.push(email); }
  if (rol) { updates.push("rol = ?"); params.push(rol); }
  if (activo !== undefined) { updates.push("activo = ?"); params.push(activo); }

  if (updates.length > 0) {
    params.push(req.params.id);
    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...params);
  }

  const user = db.prepare("SELECT id, username, nombre, email, rol, activo, created_at FROM users WHERE id = ?").get(req.params.id);
  res.json(user);
});

router.delete("/:id", authenticateToken, requireRole("Administrador"), (req, res) => {
  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.json({ message: "Usuario eliminado correctamente" });
});

export default router;
