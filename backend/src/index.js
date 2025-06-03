const express = require('express');
const app = express();
const userRoutes = require('./users/routes');
const movieRoutes = require('./movies/routes');
const cors = require('cors');
const genreRoutes = require('./movies/genreRoutes');	
const reviewRoutes = require('./reviews/routes'); // ADICIONE ESTA LINHA

app.use(express.json());
app.use(cors());

// Rotas organizadas por entidade
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/genres', genreRoutes);
app.use('/reviews', reviewRoutes); // ADICIONE ESTA LINHA

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});