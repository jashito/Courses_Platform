# Especificación de Wireframe para las Páginas Principales

## Página Principal (/)
- **Sección de bienvenida**: 
  - Texto introductorio sobre la plataforma.
- **Lista de cursos destacados**:  
  - Muestra cursos populares con imágenes y enlaces a la página de detalles.
- **Acciones del usuario**:
  - Registro/inicio de sesión.
  - Navegación a más cursos.

## Lista de Cursos (/cursos)
- **Encabezado de cursos**:  
  - Filtros y categorías (por ejemplo, por tema o nivel).
- **Tarjetas de cursos**:  
  - Nombre del curso.
  - Descripción corta.
  - Enlaces a la vista de detalles del curso.
- **Acciones del usuario**:
  - Seleccionar un curso para ver detalles.

## Detalle del Curso (/cursos/[id])
- **Información del curso**:  
  - Título completo.
  - Descripción detallada.
  - Instructores asociados.
- **Sección de lecciones**:  
  - Lista de lecciones incluidas en el curso.
- **Acciones del usuario**:
  - Inscripción en el curso.
  - Navegación a cada lección.

## Lección (/lecciones/[id])
- **Contenido de la lección**:  
  - Texto explicativo.
  - Recursos descargables.
- **Interacción del usuario**:  
  - Marcar lección como completada.
  - Navegación a la lección anterior/siguiente.

## Vista de Quiz (Sección)
- **Preguntas del quiz**:  
  - Pregunta de opción múltiple.
- **Contador de tiempo**:  
  - Tiempo restante para completar el quiz.
- **Acciones del usuario**:
  - Selección de respuestas.
  - Envío del quiz.

## Panel de Administración (/admin)
- **Gestión de cursos**:  
  - Crear, editar y eliminar cursos.
- **Gestión de usuarios**:  
  - Listar usuarios registrados.
- **Acciones del administrador**:
  - Ver estadísticas de usuarios y cursos.

## Estados Globales
- **Registro de usuarios**:
  - Progreso de la inscripción.
- **Estado de los cursos**:  
  - Indicadores de cursos disponibles y completados.
- **Acciones globales**:
  - Notificaciones del sistema (Ej. cambio de contraseña).

---
Esta especificación de wireframe se enfoca en la implementación y la experiencia del usuario a través de las diferentes secciones de la plataforma.