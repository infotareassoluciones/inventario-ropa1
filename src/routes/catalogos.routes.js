import { Router } from "express";
import pool from '../database.js'


const router = Router();

router.get('/catalogos/list', async (req, res) => {
    try {
        const [catalogos] = await pool.query(
            'SELECT p.ProductoID, p.Nombre, p.Descripcion, p.Precio, p.Imagen, c.Nombre AS Categoria FROM Productos p INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID ORDER BY p.Nombre ASC'
        );

        // Convierte los datos de la imagen a base64
        catalogos.forEach(catalogo => {
            if (catalogo.Imagen) {
                catalogo.Imagen = `data:image/jpeg;base64,${catalogo.Imagen.toString('base64')}`;
            }
        });

        res.render('../views/catalogos/list.hbs', { catalogos: catalogos });
        console.log(catalogos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;