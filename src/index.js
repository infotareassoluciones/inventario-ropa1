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

const app = express();
dotenv.config();

const FileStore = sessionFileStore(session);

app.use(session({
    store: new FileStore({
        // Configuración opcional para la ruta del directorio de sesiones
        // Asegúrate de que este directorio exista
        path: join(__dirname, 'sessions')
    }),
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 1800000 } // Cambia a true si usas HTTPS, maxAge en milisegundos (30 minutos)
}));

const __dirname = dirname(fileURLToPath(import.meta.url));
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
