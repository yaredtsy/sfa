const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Sales Force Automation API documentation",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves and fetches data from and to SFA.",
    contact: {
      name: "Mikiyas Girma",
      url: "https://t.me/Miku13",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/docs/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
