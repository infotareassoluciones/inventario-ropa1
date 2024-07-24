import { Router } from "express";
import pool from '../database.js'
import multer from 'multer';
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get('/productos/list',async(req, res)=>{
    try {
        const [productos] = await pool.query('SELECT p.ProductoID, p.Descripcion, p.Precio, p.Stock, p.Talla, c.Nombre AS Categoria, pr.Nombre AS PrendaNombre FROM Productos p INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID INNER JOIN Prendas pr ON p.PrendaID = pr.PrendaID ORDER BY pr.Nombre ASC;');
        res.render('../views/productos/list.hbs',{productos:productos} );
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});// Ruta para ver los detalles del producto
router.get('/productos/view/:ProductoID', async (req, res) => {
    try {
        const { ProductoID } = req.params;
        const [producto] = await pool.query(
            'SELECT p.ProductoID, p.Descripcion, p.Precio, p.Imagen, p.Stock, p.Talla, c.Nombre AS Categoria, pr.Nombre AS PrendaNombre FROM Productos p INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID INNER JOIN Prendas pr ON p.PrendaID = pr.PrendaID WHERE p.ProductoID = ?',
            [ProductoID]
        );
        producto.forEach(producto => {
            if (producto.Imagen) {
                producto.Imagen = `data:image/jpeg;base64,${producto.Imagen.toString('base64')}`;
            }
        });
        res.render('../views/productos/view.hbs', { producto: producto });
        console.log(producto);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/productos/add', async (req, res) => {
    try {
        const [prendas] = await pool.query('Select * from Prendas');
        const [categorias] = await pool.query('SELECT * FROM Categorias');
        res.render('../views/productos/add.hbs', { prendas, categorias});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/productos/add', upload.single('Imagen'), async (req, res) => {
    try {
        const { PrendaID, Descripcion, Precio, Categoria, Stock, Talla } = req.body;
        const imagenBuffer = req.file ? req.file.buffer : null;

        const [result] = await pool.query(
            'INSERT INTO Productos (PrendaID, Descripcion, Precio, CategoriaID, Imagen, Stock, Talla) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [PrendaID, Descripcion, Precio, Categoria, imagenBuffer, Stock, Talla]
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
        const [prendas] = await pool.query('Select * from Prendas');
        const [categorias] = await pool.query('SELECT * FROM Categorias');
        const [productos] = await pool.query('SELECT ProductoID, PrendaID, Descripcion, Precio, Imagen, Stock, CategoriaID, Talla FROM Productos WHERE ProductoID = ?', [ProductoID]);
        const productosEdit = productos[0];
        // Marcar la categoría seleccionada
        const prendasActualizadas = prendas.map(prenda => ({
            ...prenda,
            selected: prenda.PrendaID === productosEdit.PrendaID ? 'selected' : ''
        }));
        const categoriasActualizadas = categorias.map(categoria => ({
            ...categoria,
            selected: categoria.CategoriaID === productosEdit.CategoriaID ? 'selected' : ''
        }));

        res.render('../views/productos/edit.hbs', { productos: productosEdit,prendas: prendasActualizadas,  categorias: categoriasActualizadas });
        console.log(productos);
        console.log(prendasActualizadas);
        console.log(categoriasActualizadas);

    } catch (err) {
        
        res.status(500).json({ message: err.message });
    }
});

router.post('/productos/edit/:ProductoID', upload.single('Imagen'), async (req, res) => {
    try {
        console.log("Verdadero");
        const { ProductoID } = req.params;
        const { PrendaID, Descripcion, Precio, Stock, CategoriaID, Talla } = req.body;
        const imagenBuffer = req.file ? req.file.buffer : null;

        // Obtener la imagen actual del producto de la base de datos
        const [productoExistente] = await pool.query('SELECT Imagen FROM Productos WHERE ProductoID = ?', [ProductoID]);
        const imagenActual = productoExistente[0].Imagen;

        let imagenBase64 = imagenActual;
        var productoActualizado = {};

        // Si hay una nueva imagen, conviértela a Base64
        if (req.file) {
            productoActualizado = {
                PrendaID,
                Descripcion,
                Precio,
                Stock,
                CategoriaID,
                Talla,
                Imagen: imagenBuffer
            };
        } else {
            productoActualizado = {
                PrendaID,
                Descripcion,
                Precio,
                Stock,
                CategoriaID,
                Talla,
                Imagen: imagenBase64
            };
        }

        await pool.query('UPDATE Productos SET ? WHERE ProductoID = ?', [productoActualizado, ProductoID]);

        console.log(productoActualizado);
        res.redirect('/productos/list');
    } catch (err) {
        console.log('ERROR XXX');
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
