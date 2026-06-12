// ─── PALETA ──────────────────────────────────────────────────────────────────
export const C = {
  primary:   "#1A3C5E",
  secondary: "#2E86C1",
  success:   "#27AE60",
  warning:   "#F39C12",
  error:     "#E74C3C",
  bg:        "#F4F7FB",
  sidebar:   "#12283D",
};

// ─── DATOS MOCK ───────────────────────────────────────────────────────────────
export const STUDENTS = [
  { id:1, nombre:"Lucía Fernández",    dni:"42.311.890", legajo:"L-0021", email:"lucia.f@edu.ar",   curso:"3°A", estado:"Activo",   ingreso:"2022" },
  { id:2, nombre:"Mateo Rodríguez",    dni:"41.200.445", legajo:"L-0022", email:"mateo.r@edu.ar",   curso:"2°B", estado:"Activo",   ingreso:"2023" },
  { id:3, nombre:"Valentina López",    dni:"43.500.112", legajo:"L-0023", email:"vale.l@edu.ar",    curso:"1°A", estado:"Inactivo", ingreso:"2024" },
  { id:4, nombre:"Agustín Martínez",   dni:"40.789.334", legajo:"L-0024", email:"agus.m@edu.ar",    curso:"4°B", estado:"Activo",   ingreso:"2021" },
  { id:5, nombre:"Camila Gómez",       dni:"44.123.678", legajo:"L-0025", email:"cami.g@edu.ar",    curso:"3°B", estado:"Activo",   ingreso:"2022" },
  { id:6, nombre:"Nicolás Pérez",      dni:"41.900.221", legajo:"L-0026", email:"nico.p@edu.ar",    curso:"5°A", estado:"Activo",   ingreso:"2020" },
  { id:7, nombre:"Sofía Torres",       dni:"43.100.567", legajo:"L-0027", email:"sofi.t@edu.ar",    curso:"2°A", estado:"Inactivo", ingreso:"2023" },
  { id:8, nombre:"Ezequiel Romero",    dni:"42.500.890", legajo:"L-0028", email:"eze.r@edu.ar",     curso:"1°B", estado:"Activo",   ingreso:"2024" },
];

export const GRADES_DATA = [
  { alumno:"Lucía Fernández",    tp:8.5, final:9.0, promedio:8.75, estado:"Aprobado"  },
  { alumno:"Mateo Rodríguez",    tp:5.0, final:4.5, promedio:4.75, estado:"Reprobado" },
  { alumno:"Valentina López",    tp:7.0, final:7.5, promedio:7.25, estado:"Aprobado"  },
  { alumno:"Agustín Martínez",   tp:9.0, final:9.5, promedio:9.25, estado:"Aprobado"  },
  { alumno:"Camila Gómez",       tp:6.0, final:6.5, promedio:6.25, estado:"Aprobado"  },
  { alumno:"Nicolás Pérez",      tp:3.5, final:4.0, promedio:3.75, estado:"Reprobado" },
];

export const ACTIVITY = [
  { accion:"Nueva inscripción",    alumno:"Ezequiel Romero", tiempo:"hace 5 min",  tipo:"success" },
  { accion:"Nota actualizada",     alumno:"Camila Gómez",    tiempo:"hace 18 min", tipo:"info"    },
  { accion:"Inasistencia cargada", alumno:"Nicolás Pérez",   tiempo:"hace 32 min", tipo:"warning" },
  { accion:"Alumno dado de baja",  alumno:"Sofía Torres",    tiempo:"hace 1 h",    tipo:"error"   },
  { accion:"Nueva inscripción",    alumno:"Mateo Rodríguez", tiempo:"hace 2 h",    tipo:"success" },
];

export const PIE_DATA = [
  { name:"Aprobados",  value:68, color:"#27AE60" },
  { name:"Reprobados", value:18, color:"#E74C3C" },
  { name:"Pendientes", value:14, color:"#F39C12" },
];

export const BAR_DATA = [
  { mes:"Mar", asistencia:92 },
  { mes:"Abr", asistencia:88 },
  { mes:"May", asistencia:95 },
  { mes:"Jun", asistencia:91 },
  { mes:"Jul", asistencia:87 },
  { mes:"Ago", asistencia:93 },
];