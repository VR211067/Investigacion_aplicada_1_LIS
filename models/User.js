const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Validación del formato de correo electrónico
const emailValidator = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [emailValidator, 'Por favor ingrese un correo electrónico válido'],
    },
    password: {
        type: String,
        required: true,
    },
});

// Método para comparar contraseñas
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Middleware para encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
