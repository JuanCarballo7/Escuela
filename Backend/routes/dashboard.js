import { Router } from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/stats", authenticateToken, (req, res) => {
  const alumnosActivos = db.prepare("SELECT COUNT(*) AS count FROM students WHERE estado = 'Activo'").get();
  const totalAlumnos = db.prepare("SELECT COUNT(*) AS count FROM students").get();
  const materias = db.prepare("SELECT COUNT(*) AS count FROM subjects").get();
  const docentes = db.prepare("SELECT COUNT(*) AS count FROM users WHERE rol = 'Docente' AND activo = 1").get();
  const cursos = db.prepare("SELECT COUNT(DISTINCT curso) AS count FROM subjects").get();

  const averageAttendance = db.prepare(
    "SELECT ROUND(AVG(CAST(presente AS REAL)) * 100, 1) AS avg FROM attendance WHERE fecha >= date('now', '-30 days')"
  ).get();

  res.json({
    alumnosActivos: alumnosActivos.count,
    totalAlumnos: totalAlumnos.count,
    materias: materias.count,
    docentes: docentes.count,
    cursos: cursos.count,
    asistencia: averageAttendance.avg || 0,
  });
});

router.get("/activity", authenticateToken, (req, res) => {
  const activity = db.prepare(`
    SELECT a.*, u.nombre AS usuario_nombre
    FROM activity a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 15
  `).all();

  const formatted = activity.map(a => ({
    ...a,
    tiempo: timeAgo(a.created_at),
  }));

  res.json(formatted);
});

router.get("/pie", authenticateToken, (req, res) => {
  const aprobados = db.prepare(
    "SELECT COUNT(*) AS count FROM grades WHERE tp IS NOT NULL AND final IS NOT NULL AND (tp + final) / 2.0 >= 6"
  ).get();
  const reprobados = db.prepare(
    "SELECT COUNT(*) AS count FROM grades WHERE tp IS NOT NULL AND final IS NOT NULL AND (tp + final) / 2.0 < 6"
  ).get();
  const pendientes = db.prepare("SELECT COUNT(*) AS count FROM grades WHERE tp IS NULL OR final IS NULL").get();

  res.json([
    { name: "Aprobados", value: aprobados.count, color: "#27AE60" },
    { name: "Reprobados", value: reprobados.count, color: "#E74C3C" },
    { name: "Pendientes", value: pendientes.count, color: "#F39C12" },
  ]);
});

router.get("/bar", authenticateToken, (req, res) => {
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

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr + "Z");
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return "hace unos segundos";
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHr < 24) return `hace ${diffHr} h`;
  return `hace ${Math.floor(diffMs / 86400000)} d`;
}

export default router;
