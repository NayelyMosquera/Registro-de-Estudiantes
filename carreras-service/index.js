const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(cors());
app.use(express.json());

let carreras = [
    { id: 1, nombre: 'Ingeniería', duracion: 5 },
    { id: 2, nombre: 'Medicina', duracion: 6 },
    { id: 3, nombre: 'Educación Inicial', duracion: 6 }
];
let nextId = 3;

app.get('/api/carreras', (req, res) => {
    res.json(carreras);
});

app.get('/api/carreras/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const carrera = carreras.find(c => c.id === id);
    if (!carrera) {
        return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(carrera);
});

app.post('/api/carreras', [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('duracion').isInt().withMessage('La duración debe ser un número entero')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nombre, duracion } = req.body;
    const nuevaCarrera = { id: nextId++, nombre, duracion };
    carreras.push(nuevaCarrera);
    res.status(201).json(nuevaCarrera);
});

app.put('/api/carreras/:id', [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('duracion').optional().isInt().withMessage('La duración debe ser un número entero')
], (req, res) => {
    const id = parseInt(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const carrera = carreras.find(c => c.id === id);
    if (!carrera) {
        return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    const { nombre, duracion } = req.body;
    carrera.nombre = nombre || carrera.nombre;
    carrera.duracion = duracion || carrera.duracion;
    res.json(carrera);
});

app.delete('/api/carreras/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = carreras.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    carreras.splice(index, 1);
    res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Carreras-service corriendo en puerto ${PORT}`));
