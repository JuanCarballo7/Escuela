const BASE_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    clearToken();
    window.location.reload();
    throw new Error("Sesión expirada");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error de red");
  return data;
}

export const api = {
  login: (usuario, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ usuario, password }) }),

  me: () => request("/auth/me"),

  dashboard: {
    stats: () => request("/dashboard/stats"),
    activity: () => request("/dashboard/activity"),
    pie: () => request("/dashboard/pie"),
    bar: () => request("/dashboard/bar"),
  },

  students: {
    list: (params = "") => request(`/students${params}`),
    get: (id) => request(`/students/${id}`),
    create: (data) => request("/students", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/students/${id}`, { method: "DELETE" }),
  },

  subjects: {
    list: () => request("/subjects"),
    get: (id) => request(`/subjects/${id}`),
    create: (data) => request("/subjects", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/subjects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/subjects/${id}`, { method: "DELETE" }),
  },

  grades: {
    list: (params = "") => request(`/grades${params}`),
    create: (data) => request("/grades", { method: "POST", body: JSON.stringify(data) }),
    summary: () => request("/grades/summary"),
  },

  attendance: {
    list: (params = "") => request(`/attendance${params}`),
    create: (data) => request("/attendance", { method: "POST", body: JSON.stringify(data) }),
    stats: () => request("/attendance/stats"),
  },

  users: {
    list: () => request("/users"),
    get: (id) => request(`/users/${id}`),
    create: (data) => request("/users", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/users/${id}`, { method: "DELETE" }),
  },
};

export { getToken, setToken, clearToken };
