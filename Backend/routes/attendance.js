import { Router } from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, (req, res) => {
  const { student_id, subject_id, fecha_desde, fecha_hasta } = req.query;
  let sql = `
    SELECT a.*, s.nombre AS alumno_nombre, sub.nombre AS materia_nombre
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE 1=1
  `;
  const params = [];

  if (student_id) { sql += " AND a.student_id = ?"; params.push(student_id); }
  if (subject_id) { sql += " AND a.subject_id = ?"; params.push(subject_id); }
  if (fecha_desde) { sql += " AND a.fecha >= ?"; params.push(fecha_desde); }
  if (fecha_hasta) { sql += " AND a.fecha <= ?"; params.push(fecha_hasta); }

  sql += " ORDER BY a.fecha DESC";
  res.json(db.prepare(sql).all(...params));
});

router.post("/", authenticateToken, (req, res) => {
  const { student_id, subject_id, fecha, presente } = req.body;

  if (!student_id || !subject_id || !fecha) {
    return res.status(400).json({ error: "Alumno, materia y fecha son requeridos" });
  }

  const existing = db.prepare(
    "SELECT * FROM attendance WHERE student_id = ? AND subject_id = ? AND fecha = ?"
  ).get(student_id, subject_id, fecha);

  if (existing) {
    db.prepare("UPDATE attendance SET presente=? WHERE id=?").run(presente ?? 1, existing.id);
  } else {
    db.prepare(
      "INSERT INTO attendance (student_id, subject_id, fecha, presente) VALUES (?, ?, ?, ?)"
    ).run(student_id, subject_id, fecha, presente ?? 1);
  }

  const student = db.prepare("SELECT nombre FROM students WHERE id = ?").get(student_id);
  if (presente === 0) {
    db.prepare(
      "INSERT INTO activity (accion, alumno, user_id, tipo) VALUES (?, ?, ?, ?)"
    ).run("Inasistencia cargada", student?.nombre, req.user.id, "warning");
  }

  res.json({ message: "Asistencia registrada" });
});

router.get("/stats", authenticateToken, (req, res) => {
  const monthly = db.prepare(`
    SELECT strftime('%m', fecha) AS mes,
           ROUND(AVG(CAST(presente AS REAL)) * 100, 1) AS asistencia
    FROM attendance
    WHERE fecha >= date('now', '-6 months')
    GROUP BY strftime('%m', fecha)
    ORDER BY mes
  `).all();

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const barData = monthly.map(m => ({
    mes: meses[parseInt(m.mes) - 1] || m.mes,
    asistencia: m.asistencia,
  }));

  res.json(barData);
});

export default router;
