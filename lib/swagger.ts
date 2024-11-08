// lib/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc'

const apiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation'
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token'
      }
    }
  },
  security: [
    {
      cookieAuth: []
    }
  ]
}

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: apiConfig
  })
}