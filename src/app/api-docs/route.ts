import { NextResponse } from "next/server";
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
      schemas: {
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            is_published: { type: 'boolean' },
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
            },
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'],
};

export async function GET() {
  const specs = swaggerJsdoc(options);
  return NextResponse.json(specs);
}
