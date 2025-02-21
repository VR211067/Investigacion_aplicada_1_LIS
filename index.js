const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
dotenv.config();

const app = express();
// Middleware para procesar el cuerpo de la solicitud
app.use(bodyParser.json());  // Para procesar JSON en el cuerpo de la solicitud

// Middleware para parsear JSON
app.use(express.json());

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => console.log('Error de conexión con MongoDB:', err));

// Rutas
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando');
  });
  

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Manejo de cierre de servidor
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Servidor cerrado');
        mongoose.connection.close();
    });
});
