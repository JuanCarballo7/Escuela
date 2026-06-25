import { Router } from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, (req, res) => {
  const { student_id, subject_id } = req.query;
  let sql = `
    SELECT g.*, s.nombre AS alumno_nombre, sub.nombre AS materia_nombre
    FROM grades g
    JOIN students s ON g.student_id = s.id
    JOIN subjects sub ON g.subject_id = sub.id
    WHERE 1=1
  `;
  const params = [];

  if (student_id) { sql += " AND g.student_id = ?"; params.push(student_id); }
  if (subject_id) { sql += " AND g.subject_id = ?"; params.push(subject_id); }

  sql += " ORDER BY s.nombre";
  const grades = db.prepare(sql).all(...params);

  const enriched = grades.map(g => ({
    ...g,
    promedio: g.tp != null && g.final != null ? Math.round(((g.tp + g.final) / 2) * 100) / 100 : null,
    estado: g.tp != null && g.final != null ? ((g.tp + g.final) / 2 >= 6 ? "Aprobado" : "Reprobado") : "Pendiente",
  }));

  res.json(enriched);
});

router.post("/", authenticateToken, (req, res) => {
  const { student_id, subject_id, tp, final } = req.body;

  if (!student_id || !subject_id) {
    return res.status(400).json({ error: "Alumno y materia son requeridos" });
  }

  const existing = db.prepare(
    "SELECT * FROM grades WHERE student_id = ? AND subject_id = ?"
  ).get(student_id, subject_id);

  let result;
  if (existing) {
    db.prepare("UPDATE grades SET tp=?, final=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").run(
      tp ?? existing.tp, final ?? existing.final, existing.id
    );
    result = existing.id;
  } else {
    const ins = db.prepare(
      "INSERT INTO grades (student_id, subject_id, tp, final) VALUES (?, ?, ?, ?)"
    ).run(student_id, subject_id, tp ?? null, final ?? null);
    result = ins.lastInsertRowid;
  }

  const student = db.prepare("SELECT nombre FROM students WHERE id = ?").get(student_id);
  db.prepare(
    "INSERT INTO activity (accion, alumno, user_id, tipo) VALUES (?, ?, ?, ?)"
  ).run("Nota actualizada", student?.nombre, req.user.id, "info");

  const grade = db.prepare(`
    SELECT g.*, s.nombre AS alumno_nombre, sub.nombre AS materia_nombre
    FROM grades g
    JOIN students s ON g.student_id = s.id
    JOIN subjects sub ON g.subject_id = sub.id
    WHERE g.id = ?
  `).get(result);

  res.status(201).json({
    ...grade,
    promedio: grade.tp != null && grade.final != null ? Math.round(((grade.tp + grade.final) / 2) * 100) / 100 : null,
    estado: grade.tp != null && grade.final != null ? ((grade.tp + grade.final) / 2 >= 6 ? "Aprobado" : "Reprobado") : "Pendiente",
  });
});

router.get("/summary", authenticateToken, (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS count FROM grades WHERE tp IS NOT NULL AND final IS NOT NULL").get();
  const aprobados = db.prepare(
    "SELECT COUNT(*) AS count FROM grades WHERE tp IS NOT NULL AND final IS NOT NULL AND (tp + final) / 2.0 >= 6"
  ).get();
  const reprobados = db.prepare(
    "SELECT COUNT(*) AS count FROM grades WHERE tp IS NOT NULL AND final IS NOT NULL AND (tp + final) / 2.0 < 6"
  ).get();
  const pendientes = db.prepare("SELECT COUNT(*) AS count FROM grades WHERE tp IS NULL OR final IS NULL").get();

  res.json({
    total: total.count,
    aprobados: aprobados.count,
    reprobados: reprobados.count,
    pendientes: pendientes.count,
  });
});

export default router;
