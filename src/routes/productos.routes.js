import { Router } from "express";
import pool from '../database.js'
import multer from 'multer';


const router = Router();

router.get('/productos/list',async(req, res)=>{
    try {
        const [productos] = await pool.query('SELECT ProductoID, p.Nombre, p.Descripcion, p.Precio, p.Stock, c.Nombre AS Categoria FROM Productos p INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID ORDER BY p.Nombre ASC ');
        res.render('../views/productos/list.hbs',{productos:productos} );
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

router.get('/productos/edit/:ProductoID', async (req, res) => {
    try {
        const { ProductoID } = req.params;
        const [categorias] = await pool.query('SELECT * FROM Categorias');
        const [productos] = await pool.query('SELECT ProductoID, Nombre, Descripcion, Precio, Imagen, Stock, CategoriaID FROM Productos WHERE ProductoID = ?', [ProductoID]);
        const productosEdit = productos[0];

        const categoriasProcesadas = categorias.map(categoria => ({
            ...categoria,
            selected: categoria.CategoriaID === productosEdit.CategoriaID ? 'selected' : ''
        }));

        res.render('../views/productos/edit.hbs', { productos: productosEdit, categorias: categoriasProcesadas });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

    
router.post('/productos/edit/:ProductoID',upload.single('Imagen'), async (req, res) => {
    try {
        const imagenBuffer = req.file ? req.file.buffer : null;
        const { ProductoID } = req.params;
        const {Imagen} = req.body;
        const { Nombre, Descripcion, Precio, CategoriaID, Stock } = req.body;
        var productoActualizado ={};
        if(Imagen == null){
            productoActualizado = {
                Nombre,
                Descripcion,
                Precio,
                CategoriaID,
                Stock,
            

            }
        }else(
             productoActualizado = {
                Nombre,
                Descripcion,
                Precio,
                CategoriaID,
                Stock,
                Imagen :Imagen

            }
        );

        // Actualiza el producto en la base de datos
        await pool.query('UPDATE Productos SET ? WHERE ProductoID = ?', [productoActualizado, ProductoID]);
        console.log(productoActualizado);
        // Redirige al usuario a la lista de productos o a otra página
        res.redirect('/productos/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});





    router.get('/categorias/delete/:CategoriaID',async(req, res)=>{
            try {
                const {CategoriaID} = req.params;
                await pool.query('DELETE FROM Categorias WHERE CategoriaID = ?', [CategoriaID]);
                res.redirect('/categorias/list');
                
            } catch (err) {
                res.status(500).json({message:err.message});
            }
    });
export default router;
