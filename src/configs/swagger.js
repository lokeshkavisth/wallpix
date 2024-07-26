const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wallpaper App API",
      version: "1.0.0",
      description: "API for a wallpaper sharing mobile application",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  apis: ["../routes/*.js"], // Path to the API routes folder
};

const specs = swaggerJsdoc(options);

module.exports = specs;
