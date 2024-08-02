import { Router } from "express"; 
const router = Router();
import pool from '../database.js'
import bcrypt from "bcrypt";

// Mostrar la página de registro
router.get('/register', async (req, res) => {
    const [roles] = await pool.query('SELECT * FROM Roles');
    res.render('register', { roles });
});

router.post('/register', async (req, res) => {
    const { Nombre, Apellido, Usuario, Password, RolID } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        await pool.query('INSERT INTO Usuarios (Nombre, Apellido, Usuario, Password, RolID) VALUES (?, ?, ?, ?, ?)', 
            [Nombre, Apellido, Usuario, hashedPassword, RolID]);
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});
export default router;