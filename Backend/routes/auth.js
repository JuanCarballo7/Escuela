import { Router } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { JWT_SECRET, authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Usuario y contraseña requeridos" });
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ? AND activo = 1").get(usuario);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  db.prepare(
    "INSERT INTO activity (accion, alumno, user_id, tipo) VALUES (?, ?, ?, ?)"
  ).run(`Inicio de sesión: ${user.nombre}`, null, user.id, "info");

  res.json({
    token,
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol, username: user.username },
  });
});

router.get("/me", authenticateToken, (req, res) => {
  res.json(req.user);
});

export default router;
