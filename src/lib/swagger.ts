import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Courses Platform API',
      version: '1.0.0',
      description: 'API para la plataforma de cursos corporativos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            is_published: { type: 'boolean' },
            created_by: { type: 'string' },
          },
        },
        Module: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            course_id: { type: 'string' },
            title: { type: 'string' },
            position: { type: 'number' },
          },
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            module_id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            video_url: { type: 'string' },
            position: { type: 'number' },
          },
        },
        Progress: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user_id: { type: 'string' },
            lesson_id: { type: 'string' },
            status: { type: 'string' },
            percent: { type: 'number' },
          },
        },
      },
    },
    paths: {
      '/api/courses': {
        get: {
          summary: 'Obtener todos los cursos',
          responses: {
            '200': {
              description: 'Lista de cursos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Course' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Crear un nuevo curso',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    is_published: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Curso creado',
            },
            '403': {
              description: 'Forbidden - Solo admin/instructor',
            },
          },
        },
      },
      '/api/courses/{id}': {
        get: {
          summary: 'Obtener un curso por ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Curso encontrado',
            },
            '404': {
              description: 'Curso no encontrado',
            },
          },
        },
      },
      '/api/modules': {
        get: {
          summary: 'Obtener módulos',
          parameters: [
            {
              name: 'course_id',
              in: 'query',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Lista de módulos',
            },
          },
        },
        post: {
          summary: 'Crear un módulo',
          security: [{ bearerAuth: [] }],
          responses: {
            '201': {
              description: 'Módulo creado',
            },
            '403': {
              description: 'Forbidden',
            },
          },
        },
      },
      '/api/lessons/{id}': {
        get: {
          summary: 'Obtener una lección',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Lección encontrada',
            },
            '404': {
              description: 'Lección no encontrada',
            },
          },
        },
      },
      '/api/progress': {
        get: {
          summary: 'Obtener progreso del usuario',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Lista de progreso',
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
        post: {
          summary: 'Actualizar progreso',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Progreso actualizado',
            },
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'],
};

export const specs = swaggerJsdoc(options);
