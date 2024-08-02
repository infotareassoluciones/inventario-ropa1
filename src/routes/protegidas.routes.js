// src/routes/protegidas.routes.js
import { Router } from 'express';
//import { isAuthenticated } from '../authMiddleware.js';

const router = Router();

router.get('/categorias', isAuthenticated, (req, res) => {
    res.render('categorias');
});

router.get('/clientes', isAuthenticated, (req, res) => {
    res.render('clientes');
});

// Agrega más rutas protegidas aquí...

export default router;
