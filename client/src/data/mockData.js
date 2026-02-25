// Datos mock para la preview de FlickDo
// Este archivo contiene datos de ejemplo para demostrar la funcionalidad de la aplicación

export const mockUser = {
  id: "preview-user-001",
  email: "demo@flickdo.com",
  created_at: "2024-01-01T00:00:00.000Z",
  email_confirmed_at: "2024-01-01T00:00:00.000Z",
  user_metadata: {
    firstName: "Demo",
    lastName: "User",
  },
};

export const mockProfile = {
  id: "preview-user-001",
  email: "demo@flickdo.com",
  first_name: "Demo",
  last_name: "User",
  avatar_url: null,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

export const mockLists = [
  {
    id: "list-001",
    title: "Trabajo",
    description: "Tareas relacionadas con el trabajo",
    icon: "briefcase",
    color: "#4f46e5",
    user_id: "preview-user-001",
    created_at: "2024-01-15T10:00:00.000Z",
    updated_at: "2024-01-15T10:00:00.000Z",
    tasks: [
      {
        id: "task-001",
        title: "Completar presentation del Q1",
        description: "Preparar slides para la reunion con el equipo ejecutivo",
        completed: false,
        priority: "high",
        due_date: "2026-02-28",
        list_id: "list-001",
        user_id: "preview-user-001",
        position: 0,
        created_at: "2024-01-15T10:30:00.000Z",
        updated_at: "2024-01-15T10:30:00.000Z",
        tags: [
          { id: "tag-001", name: "Urgente", color: "#ef4444" },
          { id: "tag-002", name: "Reunión", color: "#f59e0b" },
        ],
      },
      {
        id: "task-002",
        title: "Revisar código del nuevo feature",
        description:
          "Code review para la implementación del sistema de notificaciones",
        completed: false,
        priority: "medium",
        due_date: "2026-02-27",
        list_id: "list-001",
        user_id: "preview-user-001",
        position: 1,
        created_at: "2024-01-16T09:00:00.000Z",
        updated_at: "2024-01-16T09:00:00.000Z",
        tags: [{ id: "tag-003", name: "Dev", color: "#3b82f6" }],
      },
      {
        id: "task-003",
        title: "Actualizar documentación del API",
        description: "Añadir ejemplos de los nuevos endpoints",
        completed: true,
        priority: "low",
        due_date: null,
        list_id: "list-001",
        user_id: "preview-user-001",
        position: 2,
        created_at: "2024-01-14T14:00:00.000Z",
        updated_at: "2024-02-20T11:00:00.000Z",
        tags: [{ id: "tag-004", name: "Documentación", color: "#8b5cf6" }],
      },
    ],
  },
  {
    id: "list-002",
    title: "Estudios",
    description: "Cursos y aprendizaje",
    icon: "book",
    color: "#9333ea",
    user_id: "preview-user-001",
    created_at: "2024-01-10T08:00:00.000Z",
    updated_at: "2024-01-10T08:00:00.000Z",
    tasks: [
      {
        id: "task-004",
        title: "Terminar curso de React Advanced Patterns",
        description: "Completar los últimos 3 módulos del curso",
        completed: false,
        priority: "medium",
        due_date: "2026-03-05",
        list_id: "list-002",
        user_id: "preview-user-001",
        position: 0,
        created_at: "2024-01-10T08:30:00.000Z",
        updated_at: "2024-01-10T08:30:00.000Z",
        tags: [
          { id: "tag-005", name: "Educación", color: "#06b6d4" },
          { id: "tag-003", name: "Dev", color: "#3b82f6" },
        ],
      },
      {
        id: "task-005",
        title: "Leer artículo sobre arquitectura de microservicios",
        description:
          "Artículo de Martin Fowler sobre patrones de microservicios",
        completed: false,
        priority: "low",
        due_date: null,
        list_id: "list-002",
        user_id: "preview-user-001",
        position: 1,
        created_at: "2024-01-12T16:00:00.000Z",
        updated_at: "2024-01-12T16:00:00.000Z",
        tags: [{ id: "tag-005", name: "Educación", color: "#06b6d4" }],
      },
      {
        id: "task-006",
        title: "Practicar algoritmos en LeetCode",
        description: "Resolver 5 problemas de nivel medio",
        completed: true,
        priority: "low",
        due_date: null,
        list_id: "list-002",
        user_id: "preview-user-001",
        position: 2,
        created_at: "2024-01-11T19:00:00.000Z",
        updated_at: "2024-02-15T20:30:00.000Z",
        tags: [
          { id: "tag-005", name: "Educación", color: "#06b6d4" },
          { id: "tag-003", name: "Dev", color: "#3b82f6" },
        ],
      },
    ],
  },
  {
    id: "list-003",
    title: "Personal",
    description: "Tareas personales y gestiones",
    icon: "heart",
    color: "#10b981",
    user_id: "preview-user-001",
    created_at: "2024-01-08T12:00:00.000Z",
    updated_at: "2024-01-08T12:00:00.000Z",
    tasks: [
      {
        id: "task-007",
        title: "Comprar regalo de cumpleaños",
        description: "Buscar algo especial para el cumpleaños de mamá",
        completed: false,
        priority: "high",
        due_date: "2026-03-01",
        list_id: "list-003",
        user_id: "preview-user-001",
        position: 0,
        created_at: "2024-01-20T13:00:00.000Z",
        updated_at: "2024-01-20T13:00:00.000Z",
        tags: [{ id: "tag-006", name: "Compras", color: "#ec4899" }],
      },
      {
        id: "task-008",
        title: "Renovar suscripción del gimnasio",
        description: "La suscripción vence el próximo mes",
        completed: false,
        priority: "medium",
        due_date: "2026-03-10",
        list_id: "list-003",
        user_id: "preview-user-001",
        position: 1,
        created_at: "2024-01-18T10:00:00.000Z",
        updated_at: "2024-01-18T10:00:00.000Z",
        tags: [{ id: "tag-007", name: "Salud", color: "#22c55e" }],
      },
      {
        id: "task-009",
        title: "Organizar armario de ropa",
        description: "Donar ropa que ya no uso",
        completed: true,
        priority: "low",
        due_date: null,
        list_id: "list-003",
        user_id: "preview-user-001",
        position: 2,
        created_at: "2024-01-05T15:00:00.000Z",
        updated_at: "2024-02-18T17:00:00.000Z",
        tags: [{ id: "tag-008", name: "Casa", color: "#f97316" }],
      },
    ],
  },
  {
    id: "list-004",
    title: "Proyectos",
    description: "Proyectos personales y side projects",
    icon: "code",
    color: "#f59e0b",
    user_id: "preview-user-001",
    created_at: "2024-01-05T09:00:00.000Z",
    updated_at: "2024-01-05T09:00:00.000Z",
    tasks: [
      {
        id: "task-010",
        title: "Implementar modo oscuro en portfolio",
        description:
          "Añadir toggle de tema y persistir preferencia del usuario",
        completed: false,
        priority: "medium",
        due_date: "2026-02-26",
        list_id: "list-004",
        user_id: "preview-user-001",
        position: 0,
        created_at: "2024-01-22T11:00:00.000Z",
        updated_at: "2024-01-22T11:00:00.000Z",
        tags: [
          { id: "tag-003", name: "Dev", color: "#3b82f6" },
          { id: "tag-009", name: "Portfolio", color: "#14b8a6" },
        ],
      },
      {
        id: "task-011",
        title: "Escribir artículo sobre hooks en React",
        description: "Tutorial sobre custom hooks y optimización",
        completed: false,
        priority: "low",
        due_date: null,
        list_id: "list-004",
        user_id: "preview-user-001",
        position: 1,
        created_at: "2024-01-19T14:00:00.000Z",
        updated_at: "2024-01-19T14:00:00.000Z",
        tags: [
          { id: "tag-003", name: "Dev", color: "#3b82f6" },
          { id: "tag-010", name: "Blog", color: "#a855f7" },
        ],
      },
    ],
  },
];

export const mockTags = [
  {
    id: "tag-001",
    name: "Urgente",
    color: "#ef4444",
    user_id: "preview-user-001",
  },
  {
    id: "tag-002",
    name: "Reunión",
    color: "#f59e0b",
    user_id: "preview-user-001",
  },
  { id: "tag-003", name: "Dev", color: "#3b82f6", user_id: "preview-user-001" },
  {
    id: "tag-004",
    name: "Documentación",
    color: "#8b5cf6",
    user_id: "preview-user-001",
  },
  {
    id: "tag-005",
    name: "Educación",
    color: "#06b6d4",
    user_id: "preview-user-001",
  },
  {
    id: "tag-006",
    name: "Compras",
    color: "#ec4899",
    user_id: "preview-user-001",
  },
  {
    id: "tag-007",
    name: "Salud",
    color: "#22c55e",
    user_id: "preview-user-001",
  },
  {
    id: "tag-008",
    name: "Casa",
    color: "#f97316",
    user_id: "preview-user-001",
  },
  {
    id: "tag-009",
    name: "Portfolio",
    color: "#14b8a6",
    user_id: "preview-user-001",
  },
  {
    id: "tag-010",
    name: "Blog",
    color: "#a855f7",
    user_id: "preview-user-001",
  },
];

// Función auxiliar para obtener todas las tareas de todas las listas
export const getAllTasks = () => {
  return mockLists.flatMap((list) => list.tasks || []);
};

// Función auxiliar para obtener una lista por ID
export const getListById = (listId) => {
  return mockLists.find((list) => list.id === listId);
};

// Función auxiliar para obtener una tarea por ID
export const getTaskById = (taskId) => {
  const allTasks = getAllTasks();
  return allTasks.find((task) => task.id === taskId);
};
