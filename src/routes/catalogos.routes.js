import { Router } from "express";
import pool from '../database.js'


const router = Router();

router.get('/catalogos/list', async (req, res) => {
    try {
        const [catalogos] = await pool.query(
            'SELECT p.Descripcion, p.Precio, p.Imagen, p.Stock, p.Talla, c.Nombre AS Categoria, pr.Nombre AS PrendaNombre FROM Productos p INNER JOIN Categorias c ON p.CategoriaID = c.CategoriaID INNER JOIN Prendas pr ON p.PrendaID = pr.PrendaID ORDER BY pr.Nombre ASC;'
            
        );

        // Convierte los datos de la imagen a base64
        catalogos.forEach(catalogo => {
            if (catalogo.Imagen) {
                catalogo.Imagen = `data:image/jpeg;base64,${catalogo.Imagen.toString('base64')}`;
            }
        });

        res.render('../views/catalogos/list.hbs', { catalogos: catalogos });
        console.log(catalogos.Imagen);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;