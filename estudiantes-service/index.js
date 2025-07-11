const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(cors());
app.use(express.json());

let estudiantes = [
    { id: 1, nombre: 'Nayely Mosquera', email: 'nmosquera1039@utm.edu.ec', carreraId: 1 },
    { id: 2, nombre: 'Naiuska Zipa', email: 'nzipa0516@utm.edu.ec', carreraId: 2 },
    { id: 1, nombre: 'Ines Gallegos', email: 'igallegos5048@utm.edu.ec', carreraId: 1 },
    { id: 2, nombre: 'Carmen Tuarez', email: 'ctuarez6882@utm.edu.ec', carreraId: 2 }
];
let nextId = 3;

app.get('/api/estudiantes', (req, res) => {
    res.json(estudiantes);
});

app.get('/api/estudiantes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(estudiante);
});

app.post('/api/estudiantes', [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('carreraId').isInt().withMessage('carreraId debe ser un número entero')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nombre, email, carreraId } = req.body;
    const nuevoEstudiante = { id: nextId++, nombre, email, carreraId };
    estudiantes.push(nuevoEstudiante);
    res.status(201).json(nuevoEstudiante);
});

app.put('/api/estudiantes/:id', [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('carreraId').optional().isInt().withMessage('carreraId debe ser un número entero')
], (req, res) => {
    const id = parseInt(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    const { nombre, email, carreraId } = req.body;
    estudiante.nombre = nombre || estudiante.nombre;
    estudiante.email = email || estudiante.email;
    estudiante.carreraId = carreraId || estudiante.carreraId;
    res.json(estudiante);
});

app.delete('/api/estudiantes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = estudiantes.findIndex(e => e.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    estudiantes.splice(index, 1);
    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Estudiantes-service corriendo en puerto ${PORT}`));
