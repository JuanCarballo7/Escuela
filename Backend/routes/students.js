import { Router } from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, (req, res) => {
  const { curso, estado, q } = req.query;
  let sql = "SELECT * FROM students WHERE 1=1";
  const params = [];

  if (curso) { sql += " AND curso = ?"; params.push(curso); }
  if (estado) { sql += " AND estado = ?"; params.push(estado); }
  if (q) { sql += " AND (nombre LIKE ? OR dni LIKE ? OR legajo LIKE ?)"; params.push(`%${q}%`, `%${q}%`, `%${q}%`); }

  sql += " ORDER BY nombre";
  const students = db.prepare(sql).all(...params);
  res.json(students);
});

router.get("/:id", authenticateToken, (req, res) => {
  const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
  if (!student) return res.status(404).json({ error: "Alumno no encontrado" });
  res.json(student);
});

router.post("/", authenticateToken, (req, res) => {
  const { nombre, dni, legajo, email, curso, estado, ingreso } = req.body;

  if (!nombre || !dni || !legajo || !curso) {
    return res.status(400).json({ error: "Nombre, DNI, legajo y curso son requeridos" });
  }

  try {
    const result = db.prepare(
      "INSERT INTO students (nombre, dni, legajo, email, curso, estado, ingreso) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(nombre, dni, legajo, email || null, curso, estado || "Activo", ingreso || String(new Date().getFullYear()));

    db.prepare(
      "INSERT INTO activity (accion, alumno, user_id, tipo) VALUES (?, ?, ?, ?)"
    ).run("Nueva inscripción", nombre, req.user.id, "success");

    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(student);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "El DNI o legajo ya existe" });
    }
    throw err;
  }
});

router.put("/:id", authenticateToken, (req, res) => {
  const { nombre, dni, legajo, email, curso, estado, ingreso } = req.body;
  const existing = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Alumno no encontrado" });

  try {
    db.prepare(
      `UPDATE students SET nombre=?, dni=?, legajo=?, email=?, curso=?, estado=?, ingreso=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).run(
      nombre || existing.nombre,
      dni || existing.dni,
      legajo || existing.legajo,
      email !== undefined ? email : existing.email,
      curso || existing.curso,
      estado || existing.estado,
      ingreso || existing.ingreso,
      req.params.id
    );

    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
    res.json(student);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "El DNI o legajo ya existe" });
    }
    throw err;
  }
});

router.delete("/:id", authenticateToken, (req, res) => {
  const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
  if (!student) return res.status(404).json({ error: "Alumno no encontrado" });

  db.prepare("DELETE FROM grades WHERE student_id = ?").run(req.params.id);
  db.prepare("DELETE FROM attendance WHERE student_id = ?").run(req.params.id);
  db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);

  db.prepare(
    "INSERT INTO activity (accion, alumno, user_id, tipo) VALUES (?, ?, ?, ?)"
  ).run("Alumno eliminado", student.nombre, req.user.id, "error");

  res.json({ message: "Alumno eliminado correctamente" });
});

export default router;
