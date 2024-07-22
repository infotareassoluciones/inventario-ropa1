import { Router } from "express";
import pool from '../database.js'
import multer from 'multer';


const router = Router();

router.get('/productos/list',async(req, res)=>{
    try {
        const [productos] = await pool.query('SELECT ProductoID, p.Nombre, p.Descripcion, p.Precio, p.Stock, c.Nombre AS Categoria FROM Productos p INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID ORDER BY p.Nombre ASC ');
        res.render('../views/productos/list.hbs',{productos:productos} );
       
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
        console.log(imagenBuffer);
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

        // Marcar la categoría seleccionada
        const categoriasActualizadas = categorias.map(categoria => ({
            ...categoria,
            selected: categoria.CategoriaID === productosEdit.CategoriaID ? 'selected' : ''
        }));

        res.render('../views/productos/edit.hbs', { productos: productosEdit, categorias: categoriasActualizadas });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

   
router.post('/productos/edit/:ProductoID', upload.single('Imagen'), async (req, res) => {
    try {
        const { ProductoID } = req.params;
        const { Nombre, Descripcion, Precio, CategoriaID, Stock } = req.body;
        const imagenBuffer = req.file ? req.file.buffer : null;

        // Obtener la imagen actual del producto de la base de datos
        const [productoExistente] = await pool.query('SELECT Imagen FROM Productos WHERE ProductoID = ?', [ProductoID]);
        const imagenActual = productoExistente[0].Imagen;

        let imagenBase64 = imagenActual;
        var productoActualizado = {};

        // Si hay una nueva imagen, conviértela a Base64
        if (req.file) {
            productoActualizado = {
                Nombre,
                Descripcion,
                Precio,
                CategoriaID,
                Stock,
                Imagen:imagenBuffer
            };
            await pool.query('UPDATE Productos SET ? WHERE ProductoID = ?', [productoActualizado, ProductoID]);
        }else{
             productoActualizado = {
                Nombre,
                Descripcion,
                Precio,
                CategoriaID,
                Stock,
                Imagen: imagenActual
            };
            await pool.query('UPDATE Productos SET ? WHERE ProductoID = ?', [productoActualizado, ProductoID]);
        }

        

        
        console.log(productoActualizado);
        res.redirect('/productos/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




    router.get('/productos/delete/:ProductoID',async(req, res)=>{
            try {
                const {ProductoID} = req.params;
                await pool.query('DELETE FROM Productos WHERE ProductoID = ?', [ProductoID]);
                res.redirect('/productos/list');
                
            } catch (err) {
                res.status(500).json({message:err.message});
            }
    });
export default router;
