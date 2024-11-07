import { createSwaggerSpec } from 'next-swagger-doc';

const apiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Job Application Tracker API',
    version: '1.0.0',
    description: 'API documentation for the Job Application Tracker',
  },
  servers: [
    {
      url: '/api',
      description: 'API endpoint',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Jobs', description: 'Job application management' },
    { name: 'Companies', description: 'Company management' },
    { name: 'Contacts', description: 'Contact management' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Job: {
        type: 'object',
        required: ['title'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          company_id: { type: 'string', format: 'uuid' },
          url: { type: 'string' },
          status: {
            type: 'string',
            enum: ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'],
          },
          resume_id: { type: 'string', format: 'uuid' },
          application_date: { type: 'string', format: 'date' },
          notes: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Company: {
        type: 'object',
        required: ['name'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          website: { type: 'string' },
          industry: { type: 'string' },
          location: { type: 'string' },
          notes: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Contact: {
        type: 'object',
        required: ['name'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          company_id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          position: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          linkedin_url: { type: 'string' },
          notes: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ cookieAuth: [] }],
};

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: apiConfig,
  });
};