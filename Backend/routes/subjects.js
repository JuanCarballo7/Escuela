import { Router } from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, (req, res) => {
  const subjects = db.prepare(`
    SELECT s.*, u.nombre AS docente_nombre
    FROM subjects s
    LEFT JOIN users u ON s.docente_id = u.id
    ORDER BY s.curso, s.nombre
  `).all();
  res.json(subjects);
});

router.get("/:id", authenticateToken, (req, res) => {
  const subject = db.prepare(`
    SELECT s.*, u.nombre AS docente_nombre
    FROM subjects s
    LEFT JOIN users u ON s.docente_id = u.id
    WHERE s.id = ?
  `).get(req.params.id);
  if (!subject) return res.status(404).json({ error: "Materia no encontrada" });
  res.json(subject);
});

router.post("/", authenticateToken, (req, res) => {
  const { nombre, curso, docente_id, horas_semanales } = req.body;
  if (!nombre || !curso) {
    return res.status(400).json({ error: "Nombre y curso son requeridos" });
  }

  const result = db.prepare(
    "INSERT INTO subjects (nombre, curso, docente_id, horas_semanales) VALUES (?, ?, ?, ?)"
  ).run(nombre, curso, docente_id || null, horas_semanales || 4);

  const subject = db.prepare("SELECT s.*, u.nombre AS docente_nombre FROM subjects s LEFT JOIN users u ON s.docente_id = u.id WHERE s.id = ?").get(result.lastInsertRowid);
  res.status(201).json(subject);
});

router.put("/:id", authenticateToken, (req, res) => {
  const { nombre, curso, docente_id, horas_semanales } = req.body;
  const existing = db.prepare("SELECT * FROM subjects WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Materia no encontrada" });

  db.prepare(
    "UPDATE subjects SET nombre=?, curso=?, docente_id=?, horas_semanales=? WHERE id=?"
  ).run(
    nombre || existing.nombre,
    curso || existing.curso,
    docente_id !== undefined ? docente_id : existing.docente_id,
    horas_semanales || existing.horas_semanales,
    req.params.id
  );

  const subject = db.prepare("SELECT s.*, u.nombre AS docente_nombre FROM subjects s LEFT JOIN users u ON s.docente_id = u.id WHERE s.id = ?").get(req.params.id);
  res.json(subject);
});

router.delete("/:id", authenticateToken, (req, res) => {
  const subject = db.prepare("SELECT * FROM subjects WHERE id = ?").get(req.params.id);
  if (!subject) return res.status(404).json({ error: "Materia no encontrada" });

  db.prepare("DELETE FROM grades WHERE subject_id = ?").run(req.params.id);
  db.prepare("DELETE FROM attendance WHERE subject_id = ?").run(req.params.id);
  db.prepare("DELETE FROM subjects WHERE id = ?").run(req.params.id);

  res.json({ message: "Materia eliminada correctamente" });
});

export default router;
