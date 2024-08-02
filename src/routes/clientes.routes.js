import { Router } from "express";
import pool from '../database.js'
import { isAuthenticated } from '../authMiddleware.js';
const router = Router();
router.use(isAuthenticated);
router.get('/clientes/list',async(req, res)=>{
    try {
        const [clientes] = await pool.query('SELECT * FROM Clientes order by Apellido asc');
        res.render('../views/clientes/list.hbs',{clientes:clientes} );
        console.log(clientes);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});
router.get('/clientes/add', (req, res)=>{
    res.render('../views/clientes/add.hbs');
});
router.post('/clientes/add',async(req, res)=>{
    try {
        const {Nombre, Apellido, Email, Telefono, Direccion, Cedula} = req.body;
        const newclientes ={
            Nombre,
            Apellido,
            Email,
            Telefono,
            Direccion,
            Cedula
        }
        await pool.query('INSERT INTO Clientes SET ?', [newclientes]);
        res.redirect('/clientes/list');
        console.log(newclientes);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})


router.get('/clientes/edit/:ClienteID',async(req, res)=>{
try {
    const{ClienteID} = req.params;
    const [clientes] = await pool.query('SELECT * FROM Clientes where ClienteID = ?', [ClienteID]);
    const clientesEdit = clientes[0];
    res.render('../views/clientes/edit.hbs', {clientes: clientesEdit});
    console.log(clientes);
} catch (err) {
    res.status(500).json({message:err.message});
}
});
router.post('/clientes/edit/:ClienteID',async(req, res)=>{
    try {
        const {Nombre, Apellido, Direccion, Cedula, Email, Telefono}= req.body;
        const{ClienteID} = req.params;
        const editclientes = {Nombre, Apellido, Direccion, Cedula, Email, Telefono};
        await pool.query('UPDATE Clientes SET ? WHERE ClienteID = ?', [editclientes, ClienteID]);
        console.log(editclientes);
        res.redirect('/clientes/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
    });
router.get('/clientes/delete/:ClienteID',async(req, res)=>{
        try {
            const {ClienteID} = req.params;
            await pool.query('DELETE FROM Clientes WHERE ClienteID = ?', [ClienteID]);
            res.redirect('/clientes/list');
            
        } catch (err) {
            res.status(500).json({message:err.message});
        }
});
    
export default router;