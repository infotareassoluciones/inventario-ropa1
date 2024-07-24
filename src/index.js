import express from 'express'
//import { getDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import {join,dirname, extname} from 'path'
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
// otras importaciones necesarias

// tu código aquí

//import exp from 'constants';
import dotenv from 'dotenv';
import categoriasRoutes from './routes/categorias.routes.js';
import productosRoutes from './routes/productos.routes.js';
import catalogosRoutes from './routes/catalogos.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import prendasRoutes from './routes/prendas.routes.js';

//Init
const app = express();
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, 'public')));

//config
const PORT= process.env.PORT;
app.set('port', process.env.PORT || PORT);
app.set('views',join (__dirname, 'views'));
app.engine('.hbs', engine({
    defaulLayout: 'main',
    layoutsDir: join(app.get('views'),'layouts'),
    partialsDir: join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//routes
app.get('/', (req, res)=>{
    res.render('index');
});
app.use(categoriasRoutes);
app.use(productosRoutes);
app.use(catalogosRoutes);
app.use(clientesRoutes);
app.use(prendasRoutes);
//public files
//run server
app.listen(app.get('port'), ()=>
console.log('Server Run on port:', PORT));
