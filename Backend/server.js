import express from "express";
import cors from "cors";
import { initDb } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import studentsRoutes from "./routes/students.js";
import subjectsRoutes from "./routes/subjects.js";
import gradesRoutes from "./routes/grades.js";
import attendanceRoutes from "./routes/attendance.js";
import usersRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api", (_req, res) => {
  res.json({ message: "EduGestión API v1.0", endpoints: ["auth", "students", "subjects", "grades", "attendance", "users", "dashboard"] });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});
