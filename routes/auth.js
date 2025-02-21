const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificamos si el correo ya está registrado
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Crear el nuevo usuario
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        console.error(error); // Para depuración
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar al usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Crear un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error); // Para depuración
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// Recurso protegido
router.get('/protected-resource', authenticate, (req, res) => {
    res.status(200).json({ message: 'Acceso permitido al recurso protegido' });
});

// Cerrar sesión (opcional)
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
});

// Middleware de autenticación
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer token"
    if (!token) {
        return res.status(401).json({ message: 'No autorizado. Token faltante.' });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado', error: error.message });
    }
}

module.exports = router;
