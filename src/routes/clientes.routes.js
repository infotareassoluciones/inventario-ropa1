import { Router } from "express";
import pool from '../database.js'

const router = Router();

router.get('/clientes/list',async(req, res)=>{
    try {
        const [clientes] = await pool.query('SELECT * FROM Clientes order by Nombre asc');
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
        const {Nombre, Email, Telefono, Direccion, Cedula} = req.body;
        const newclientes ={
            Nombre,
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


router.get('/categorias/edit/:CategoriaID',async(req, res)=>{
try {
    const{CategoriaID} = req.params;
    const [categorias] = await pool.query('SELECT * FROM Categorias where CategoriaID = ?', [CategoriaID]);
    const categoriaEdit = categorias[0];
    res.render('../views/categorias/edit.hbs', {categorias: categoriaEdit});
    console.log(categorias);
} catch (err) {
    res.status(500).json({message:err.message});
}
});
router.post('/categorias/edit/:CategoriaID',async(req, res)=>{
    try {
        const {Nombre}= req.body;
        const{CategoriaID} = req.params;
        const editcategoria = {Nombre};
        await pool.query('UPDATE Categorias SET ? WHERE CategoriaID = ?', [editcategoria, CategoriaID]);
        console.log(editcategoria);
        res.redirect('/categorias/list');
    } catch (err) {
        res.status(500).json({message:err.message});
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