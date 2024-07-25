import { Router } from "express";
import pool from '../database.js'
const router = Router();
import multer from 'multer';
import { format } from 'date-fns';
const upload = multer({ storage: multer.memoryStorage() }); // Define el objeto upload



router.get('/ventas/list', async (req, res) => {
    try {
        const [ventas] = await pool.query(`
            SELECT
    c.ClienteID AS ClienteID,
    CONCAT(c.Apellido, ' ', c.Nombre) AS ClienteNombre,
    DATE_FORMAT(v.FechaVenta, '%Y-%m-%d %H:%i:%s') AS FechaVentas,
    COUNT(dv.ProductoID) AS CantidadProductos,
    SUM(dv.Cantidad * dv.Precio) AS TotalDinero
FROM
    Ventas v
JOIN
    Clientes c ON v.ClienteID = c.ClienteID
JOIN
    DetalleVentas dv ON v.VentaID = dv.VentaID
GROUP BY
    v.VentaID, c.ClienteID, c.Nombre, c.Apellido, v.FechaVenta
ORDER BY
    v.FechaVenta DESC;

        `);
        res.render('../views/ventas/list.hbs', { ventas});
    } catch (err) {
        console.error('Error al obtener el reporte de ventas:', err);
        res.status(500).send('Error al obtener el reporte de ventas');
    }
});


// Mostrar formulario para agregar venta
router.get('/ventas/add', async (req, res) => {
    const [clientes] = await pool.query("SELECT ClienteID, CONCAT(Apellido,' ',Nombre) AS Nombres FROM Clientes");
    const [productos] = await pool.query("SELECT ProductoID,Stock, Precio, CONCAT(pr.Nombre, ' - ', p.Descripcion, ' - Talla: ', p.Talla) AS ProductoCompleto FROM Productos p INNER JOIN Prendas pr ON p.PrendaID = pr.PrendaID");
    
    res.render('ventas/add', { clientes, productos });
});


router.post('/ventas/add', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { ClienteID, ProductoID, Cantidad, PrecioUnitario, Total } = req.body;

        console.log('ClienteID:', ClienteID);
        console.log('ProductoID:', ProductoID);
        console.log('Cantidad:', Cantidad);
        console.log('PrecioUnitario:', PrecioUnitario);
        console.log('Total:', Total);

        // Verifica que los datos existan y sean arrays
        if (!Array.isArray(ProductoID) || !Array.isArray(Cantidad) || !Array.isArray(PrecioUnitario)) {
            throw new Error('Productos, Cantidad o PrecioUnitario no están en el formato esperado.');
        }

        // Inicia una transacción
        await connection.beginTransaction();

        // Inserta la venta
        const [resultVenta] = await connection.query(
            'INSERT INTO Ventas (ClienteID, FechaVenta, Total) VALUES (?, NOW(), ?)',
            [ClienteID, Total]
        );
        const ventaID = resultVenta.insertId;

        // Inserta los detalles de la venta
        const detalles = ProductoID.map((id, index) => [
            ventaID,
            id,
            Cantidad[index],
            PrecioUnitario[index]
        ]);

        await connection.query(
            'INSERT INTO DetalleVentas (VentaID, ProductoID, Cantidad, Precio) VALUES ?',
            [detalles]
        );

        // Actualiza el stock
        for (let i = 0; i < ProductoID.length; i++) {
            await connection.query(
                'UPDATE Productos SET Stock = Stock - ? WHERE ProductoID = ?',
                [Cantidad[i], ProductoID[i]]
            );
        }

        // Confirma la transacción
        await connection.commit();
        
        res.redirect('/productos/list');
    } catch (err) {
        // Reversa la transacción en caso de error
        await connection.rollback();
        console.error('Error al guardar la venta:', err);
        res.status(500).json({ message: 'Error al guardar la venta' });
    } finally {
        connection.release();
    }
});





// Mostrar factura de una venta
router.get('/ventas/view/:VentaID', async (req, res) => {
    try {
        const { VentaID } = req.params;
        const [rows] = await pool.query(`
            SELECT v.VentaID, v.FechaVent, v.Total, c.Nombre AS Cliente, p.Nombre AS Producto, dv.Cantidad, dv.PrecioUnitario
            FROM Ventas v
            JOIN Clientes c ON v.ClienteID = c.ClienteID
            JOIN DetallesVentas dv ON v.VentaID = dv.VentaID
            JOIN Productos p ON dv.ProductoID = p.ProductoID
            WHERE v.VentaID = ?
        `, [VentaID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        const factura = {
            VentaID: rows[0].VentaID,
            Fecha: rows[0].Fecha,
            Cliente: rows[0].Cliente,
            Total: rows[0].Total,
            Detalles: rows.map(row => ({
                Producto: row.Producto,
                Cantidad: row.Cantidad,
                PrecioUnitario: row.PrecioUnitario,
                Subtotal: row.Cantidad * row.PrecioUnitario
            }))
        };

        res.render('ventas/view', { factura });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;
