const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Projeto Boscov",
      version: "1.0.0",
      description: "Documentação da API do Projeto Boscov",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "./src/users/routes.js",
    "./src/movies/routes.js",
    "./src/reviews/routes.js",
    "./src/reviews/genreRoutes.js"
  ], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
module.exports = swaggerDocs;