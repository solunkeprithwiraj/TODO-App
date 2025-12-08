import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description: "API documentation for Todo App",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/**/*.ts",
    "./src/controller/**/*.ts",
    "./src/interfaces/**/*.ts",
  ],
};

export const swaggerSpecs = swaggerJsdoc(options);

export { swaggerUi };
