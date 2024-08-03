// src/routes/login.routes.js
import { Router } from 'express';
import pool from '../database.js';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/login', (req, res) => {
    if (req.session.user) {
        // Si el usuario ya está autenticado, redirige a la página principal
        return res.redirect('/');
    }
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE Usuario = ?', [usuario]);
        if (rows.length > 0) {
            const validPassword = await bcrypt.compare(password, rows[0].Password);
            if (validPassword) {
                req.session.user = rows[0];
                res.redirect('/'); // Redirige a la página principal si la autenticación es exitosa
                console.log("Login correcto:", usuario)
            } else {
                res.render('login', { error: 'Contraseña incorrecta' });
            }
        } else {
            res.render('login', { error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error('Error al realizar el login:', err);
        res.status(500).send('Error al realizar el login');
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login'); // Redirige al login después de cerrar sesión
    });
});
export default router;
