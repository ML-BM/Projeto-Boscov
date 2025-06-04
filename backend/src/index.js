const express = require('express');
const app = express();
const userRoutes = require('./users/routes');
const movieRoutes = require('./movies/routes');
const cors = require('cors');
const genreRoutes = require('./movies/genreRoutes');	
const reviewRoutes = require('./reviews/routes'); 

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./configs/swaggerConfig');

app.use(express.json());
app.use(cors());

// Rotas organizadas por entidade
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/genres', genreRoutes);
app.use('/reviews', reviewRoutes);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});