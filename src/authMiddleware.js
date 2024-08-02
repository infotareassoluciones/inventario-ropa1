// src/authMiddleware.js
export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        console.log('ususario auten');
        return next(); // Usuario autenticado, permite el acceso
        
    } else {
        if (req.path === '/login') {
            // Si ya estamos en la página de login, solo renderiza el formulario de login
            return next();
        }
        res.redirect('/login'); // Usuario no autenticado, redirige al login
    }
}

