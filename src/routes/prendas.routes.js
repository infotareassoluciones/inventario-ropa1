import { Router } from "express";
import pool from '../database.js'
//import { isAuthenticated } from '../authMiddleware.js';
const router = Router();
// router.use(isAuthenticated);
router.get('/prendas/list',async(req, res)=>{
    try {
        const [result] = await pool.query('SELECT * FROM Prendas order by Nombre asc');
        res.render('../views/prendas/list.hbs',{prendas:result} );
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});
router.get('/prendas/add', (req, res)=>{
    res.render('../views/prendas/add.hbs');
});
router.post('/prendas/add',async(req, res)=>{
    try {
        const {Nombre} = req.body;
        const newprenda ={
            Nombre
        }
        await pool.query('INSERT INTO Prendas SET ?', [newprenda]);
        res.redirect('/prendas/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})


router.get('/prendas/edit/:PrendaID',async(req, res)=>{
try {
    const{PrendaID} = req.params;
    const [prendas] = await pool.query('SELECT * FROM Prendas where PrendaID = ?', [PrendaID]);
    const prendaEdit = prendas[0];
    res.render('../views/prendas/edit.hbs', {prendas: prendaEdit});
} catch (err) {
    res.status(500).json({message:err.message});
}
});
router.post('/prendas/edit/:PrendaID',async(req, res)=>{
    try {
        const {Nombre}= req.body;
        const{PrendaID} = req.params;
        const editprenda = {Nombre};
        await pool.query('UPDATE Prendas SET ? WHERE PrendaID = ?', [editprenda, PrendaID]);
        res.redirect('/prendas/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
    });
router.get('/prendas/delete/:PrendaID',async(req, res)=>{
        try {
            const {PrendaID} = req.params;
            await pool.query('DELETE FROM Prendas WHERE PrendaID = ?', [PrendaID]);
            res.redirect('/prendas/list');
            
        } catch (err) {
            res.status(500).json({message:err.message});
        }
});
    
export default router;