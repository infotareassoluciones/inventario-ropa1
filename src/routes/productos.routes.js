import { Router } from "express";
import pool from '../database.js'
import multer from 'multer';

const router = Router();

router.get('/productos/list',async(req, res)=>{
    try {
        const [categorias] = await pool.query('SELECT * FROM Categorias');
        const [productos] = await pool.query('SELECT ProductoID, p.Nombre, p.Descripcion, p.Precio, p.Stock, c.Nombre AS Categoria FROM Productos p INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID ORDER BY p.Nombre ASC ');
        res.render('../views/productos/list.hbs',{productos:productos, categorias: categorias} );
        console.log(productos);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});


const upload = multer({ storage: multer.memoryStorage() });

router.get('/productos/add', async (req, res) => {
    try {
        const [categorias] = await pool.query('SELECT * FROM Categorias');
        res.render('../views/productos/add.hbs', { categorias });
        console.log(categorias);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/productos/add', upload.single('Imagen'), async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, Categoria, Stock } = req.body;
        const imagenBuffer = req.file ? req.file.buffer : null;

        const [result] = await pool.query(
            'INSERT INTO Productos (Nombre, Descripcion, Precio, CategoriaID, Imagen, Stock) VALUES (?, ?, ?, ?, ?, ?)',
            [Nombre, Descripcion, Precio, Categoria, imagenBuffer, Stock]
        );

        res.redirect('/productos/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default router;
