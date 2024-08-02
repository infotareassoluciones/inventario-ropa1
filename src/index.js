import express from 'express';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import categoriasRoutes from './routes/categorias.routes.js';
import productosRoutes from './routes/productos.routes.js';
import catalogosRoutes from './routes/catalogos.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import prendasRoutes from './routes/prendas.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import loginRoutes from './routes/login.routes.js';
import registerRoutes from './routes/register.routes.js';
import fs from 'fs';

// Inicializar dotenv
dotenv.config();

// Obtener el directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Crear carpeta para sesiones si no existe
const sessionsDir = join(__dirname, 'sessions');
if (!fs.existsSync(sessionsDir)) {
    console.log("Carpeta existente");
    try {
        fs.mkdirSync(sessionsDir);
    } catch (error) {
        console.error('Error creando el directorio de sesiones:', error);
    }
}

const FileStore = sessionFileStore(session);

// Configurar express
const app = express();

app.use(session({
    store: new FileStore({
        path: sessionsDir
    }),
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 1800000 } // Cambia a true si usas HTTPS, maxAge en milisegundos (30 minutos)
}));

app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views', 'layouts'),
    partialsDir: join(__dirname, 'views', 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(express.static(join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Rutas públicas antes del middleware de autenticación
app.use(loginRoutes);
app.use(registerRoutes);
app.use(catalogosRoutes);

// Middleware de autenticación para rutas protegidas
app.use(isAuthenticated);

// Rutas protegidas
app.use(categoriasRoutes);
app.use(productosRoutes);
app.use(clientesRoutes);
app.use(prendasRoutes);
app.use(ventasRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Middleware de autenticación
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}
