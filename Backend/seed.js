import { initDb } from "./config/db.js";
import db from "./config/db.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");

async function seed() {
  await initDb();

  console.log("🌱 Sembrando base de datos...");

  const hash = (p) => bcrypt.hashSync(p, 10);

  // ─── Usuarios ───────────────────────────────────────────────────────────────
  const insertUser = db.prepare(
    "INSERT OR IGNORE INTO users (username, password, nombre, email, rol) VALUES (?, ?, ?, ?, ?)"
  );

  insertUser.run("admin", hash("admin123"), "Carlos Martínez", "admin@edugestion.edu.ar", "Administrador");
  insertUser.run("preceptor", hash("preceptor123"), "José Rodríguez", "jose.rodriguez@edugestion.edu.ar", "Preceptor");

  const docentes = [
    ["laura.perez", hash("docente123"), "Laura Pérez", "laura.perez@edugestion.edu.ar", "Docente"],
    ["ricardo.gomez", hash("docente123"), "Ricardo Gómez", "ricardo.gomez@edugestion.edu.ar", "Docente"],
    ["ana.martinez", hash("docente123"), "Ana Martínez", "ana.martinez@edugestion.edu.ar", "Docente"],
    ["pablo.sanchez", hash("docente123"), "Pablo Sánchez", "pablo.sanchez@edugestion.edu.ar", "Docente"],
    ["carina.lopez", hash("docente123"), "Carina López", "carina.lopez@edugestion.edu.ar", "Docente"],
    ["diego.fernandez", hash("docente123"), "Diego Fernández", "diego.fernandez@edugestion.edu.ar", "Docente"],
    ["marcela.ruiz", hash("docente123"), "Marcela Ruiz", "marcela.ruiz@edugestion.edu.ar", "Docente"],
    ["federico.diaz", hash("docente123"), "Federico Díaz", "federico.diaz@edugestion.edu.ar", "Docente"],
    ["silvia.mendoza", hash("docente123"), "Silvia Mendoza", "silvia.mendoza@edugestion.edu.ar", "Docente"],
    ["gabriel.arias", hash("docente123"), "Gabriel Arias", "gabriel.arias@edugestion.edu.ar", "Docente"],
  ];

  for (const d of docentes) {
    insertUser.run(...d);
  }

  // Alumno como usuario
  insertUser.run("lucia.f", hash("alumno123"), "Lucía Fernández", "lucia.f@edu.ar", "Alumno");

  // ─── Alumnos ────────────────────────────────────────────────────────────────
  const insertStudent = db.prepare(
    "INSERT OR IGNORE INTO students (nombre, dni, legajo, email, curso, estado, ingreso) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const students = [
    ["Lucía Fernández", "42.311.890", "L-0021", "lucia.f@edu.ar", "3°A", "Activo", "2022"],
    ["Mateo Rodríguez", "41.200.445", "L-0022", "mateo.r@edu.ar", "2°B", "Activo", "2023"],
    ["Valentina López", "43.500.112", "L-0023", "vale.l@edu.ar", "1°A", "Inactivo", "2024"],
    ["Agustín Martínez", "40.789.334", "L-0024", "agus.m@edu.ar", "4°B", "Activo", "2021"],
    ["Camila Gómez", "44.123.678", "L-0025", "cami.g@edu.ar", "3°B", "Activo", "2022"],
    ["Nicolás Pérez", "41.900.221", "L-0026", "nico.p@edu.ar", "5°A", "Activo", "2020"],
    ["Sofía Torres", "43.100.567", "L-0027", "sofi.t@edu.ar", "2°A", "Inactivo", "2023"],
    ["Ezequiel Romero", "42.500.890", "L-0028", "eze.r@edu.ar", "1°B", "Activo", "2024"],
    ["Martina Díaz", "44.987.654", "L-0029", "martina.d@edu.ar", "3°A", "Activo", "2022"],
    ["Benjamín Álvarez", "41.567.890", "L-0030", "benja.a@edu.ar", "4°A", "Activo", "2021"],
    ["Isabella Castro", "43.234.567", "L-0031", "isabella.c@edu.ar", "5°B", "Activo", "2020"],
    ["Santiago Ruiz", "42.876.543", "L-0032", "santiago.r@edu.ar", "2°B", "Activo", "2023"],
    ["Emilia Morales", "44.345.678", "L-0033", "emilia.m@edu.ar", "1°A", "Activo", "2024"],
    ["Joaquín Vargas", "40.123.456", "L-0034", "joaquin.v@edu.ar", "4°B", "Inactivo", "2021"],
    ["Victoria Herrera", "43.789.012", "L-0035", "victoria.h@edu.ar", "3°A", "Activo", "2022"],
    ["Tomás Acosta", "44.567.890", "L-0036", "tomas.a@edu.ar", "2°A", "Activo", "2023"],
    ["Josefina Molina", "41.345.678", "L-0037", "josefina.m@edu.ar", "5°A", "Activo", "2020"],
    ["Facundo Ríos", "43.876.543", "L-0038", "facundo.r@edu.ar", "1°B", "Activo", "2024"],
    ["Brenda Castillo", "40.234.567", "L-0039", "brenda.c@edu.ar", "4°A", "Activo", "2021"],
    ["Gonzalo Navarro", "42.789.012", "L-0040", "gonzalo.n@edu.ar", "3°B", "Activo", "2022"],
  ];

  for (const s of students) {
    insertStudent.run(...s);
  }

  // ─── Materias ───────────────────────────────────────────────────────────────
  const insertSubject = db.prepare(
    "INSERT OR IGNORE INTO subjects (nombre, curso, docente_id, horas_semanales) VALUES (?, ?, ?, ?)"
  );

  // Mapa: materia -> { docente_id, horas, cursos }
  // docentes: 4=Ricardo Gómez, 5=Ana Martínez, 6=Pablo Sánchez, 7=Carina López,
  //           8=Diego Fernández, 9=Marcela Ruiz, 10=Federico Díaz, 11=Silvia Mendoza, 12=Gabriel Arias
  const subjectConfig = [
    // Matemática - Ricardo Gómez (id=4)
    { nombre: "Matemática",    docente: 4, horas: 5, niveles: [1,2,3,4,5] },
    // Lengua - Ana Martínez (id=5)
    { nombre: "Lengua",        docente: 5, horas: 4, niveles: [1,2,3,4,5] },
    // Inglés - Carina López (id=7)
    { nombre: "Inglés",        docente: 7, horas: 3, niveles: [1,2,3,4,5] },
    // Historia - Pablo Sánchez (id=6)
    { nombre: "Historia",      docente: 6, horas: 3, niveles: [1,2,3,4,5] },
    // Geografía - Pablo Sánchez (id=6)
    { nombre: "Geografía",     docente: 6, horas: 3, niveles: [1,2,3,4,5] },
    // Formación Ética - Silvia Mendoza (id=11)
    { nombre: "Formación Ética", docente: 11, horas: 2, niveles: [1,2,3,4,5] },
    // Educación Física - Federico Díaz (id=10)
    { nombre: "Educación Física", docente: 10, horas: 3, niveles: [1,2,3,4,5] },
    // Ciencias Naturales - Diego Fernández (id=8) - solo 1° y 2°
    { nombre: "Ciencias Naturales", docente: 8, horas: 3, niveles: [1,2] },
    // Biología - Diego Fernández (id=8) - 3° en adelante
    { nombre: "Biología",      docente: 8, horas: 3, niveles: [3,4,5] },
    // Física - Gabriel Arias (id=12) - 4° y 5°
    { nombre: "Física",        docente: 12, horas: 4, niveles: [4,5] },
    // Química - Gabriel Arias (id=12) - 4° y 5°
    { nombre: "Química",       docente: 12, horas: 4, niveles: [4,5] },
    // Arte - Marcela Ruiz (id=9) - 1° a 3°
    { nombre: "Arte",          docente: 9, horas: 2, niveles: [1,2,3] },
    // Música - Marcela Ruiz (id=9) - 1° y 2°
    { nombre: "Música",        docente: 9, horas: 2, niveles: [1,2] },
    // Tecnología - Federico Díaz (id=10) - 3° a 5°
    { nombre: "Tecnología",    docente: 10, horas: 2, niveles: [3,4,5] },
  ];

  const divisiones = ["A", "B"];
  let subjectCount = 0;

  for (const cfg of subjectConfig) {
    for (const nivel of cfg.niveles) {
      for (const div of divisiones) {
        const curso = `${nivel}°${div}`;
        // Skip inactive combos: 1°B doesn't exist? Actually all combos exist
        insertSubject.run(cfg.nombre, curso, cfg.docente, cfg.horas);
        subjectCount++;
      }
    }
  }

  // ─── Notas ──────────────────────────────────────────────────────────────────
  const insertGrade = db.prepare(
    "INSERT OR IGNORE INTO grades (student_id, subject_id, tp, final) VALUES (?, ?, ?, ?)"
  );

  const allSubjects = db.prepare("SELECT id, nombre, curso FROM subjects").all();
  const gradeCandidates = [];

  // Asignar notas distribuidas entre TODAS las materias de cada curso
  for (let sId = 1; sId <= 20; sId++) {
    const student = students[Math.min(sId - 1, students.length - 1)];
    const curso = student[4];
    const subjs = allSubjects.filter(sub => sub.curso === curso);
    const shuffled = subjs.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(Math.floor(Math.random() * 4) + 3, subjs.length));
    for (const sub of selected) {
      const tp = Math.round((4 + Math.random() * 6) * 10) / 10;
      const final = Math.round((4 + Math.random() * 6) * 10) / 10;
      gradeCandidates.push([sId, sub.id, tp, final]);
    }
  }

  for (const g of gradeCandidates) {
    insertGrade.run(...g);
  }

  // ─── Asistencia ─────────────────────────────────────────────────────────────
  const insertAttendance = db.prepare(
    "INSERT OR IGNORE INTO attendance (student_id, subject_id, fecha, presente) VALUES (?, ?, ?, ?)"
  );

  const today = new Date();
  for (let i = 90; i >= 0; i -= 7) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const fecha = d.toISOString().slice(0, 10);
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    for (let sId = 1; sId <= 20; sId++) {
      const presente = Math.random() > 0.15 ? 1 : 0;
      const subjs = allSubjects.filter(sub => sub.curso === students[Math.min(sId - 1, students.length - 1)][4]);
      if (subjs.length > 0) {
        const subId = subjs[sId % subjs.length].id;
        insertAttendance.run(sId, subId, fecha, presente);
      }
    }
  }

  // ─── Actividad ──────────────────────────────────────────────────────────────
  const insertActivity = db.prepare(
    "INSERT OR IGNORE INTO activity (accion, alumno, user_id, tipo) VALUES (?, ?, ?, ?)"
  );

  const activities = [
    ["Nueva inscripción", "Ezequiel Romero", 1, "success"],
    ["Nota actualizada", "Camila Gómez", 2, "info"],
    ["Inasistencia cargada", "Nicolás Pérez", 3, "warning"],
    ["Alumno dado de baja", "Sofía Torres", 1, "error"],
    ["Nueva inscripción", "Benjamín Álvarez", 1, "success"],
    ["Nota actualizada", "Lucía Fernández", 2, "info"],
    ["Inasistencia cargada", "Mateo Rodríguez", 3, "warning"],
    ["Materia creada", "Tecnología - 4°A", 1, "info"],
    ["Usuario registrado", "Gabriel Arias", 1, "success"],
  ];

  for (const a of activities) {
    insertActivity.run(...a);
  }

  console.log(`✅ Base de datos sembrada correctamente.`);
  console.log(`   ${docentes.length + 2} usuarios (${docentes.length} docentes)`);
  console.log(`   ${students.length} alumnos`);
  console.log(`   ${subjectCount} materias`);
  console.log(`   ${gradeCandidates.length} notas`);
  console.log("   Usuarios: admin/admin123 — Docentes: todos con contraseña docente123");
}

seed().catch(console.error);
