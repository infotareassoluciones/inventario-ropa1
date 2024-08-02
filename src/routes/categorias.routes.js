import { Router } from "express";
import pool from '../database.js'
import { isAuthenticated } from '../authMiddleware.js';
const router = Router();
router.use(isAuthenticated);
router.get('/categorias/list',async(req, res)=>{
    try {
        const [result] = await pool.query('SELECT * FROM Categorias order by Nombre asc');
        res.render('../views/categorias/list.hbs',{categorias:result} );
        console.log(result);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});
router.get('/categorias/add', (req, res)=>{
    res.render('../views/categorias/add.hbs');
});
router.post('/categorias/add',async(req, res)=>{
    try {
        const {Nombre} = req.body;
        const newcategoria ={
            Nombre
        }
        await pool.query('INSERT INTO Categorias SET ?', [newcategoria]);
        res.redirect('/categorias/list');
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