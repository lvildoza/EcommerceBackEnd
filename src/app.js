// ---- DEPENDENCIAS -----
import expres from 'express';
import handlebars from  'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { __dirname } from './utils.js';
import configEnv from './config/env.config.js';
import './config/db.js';
import initializePassport from './config/passport.config.js';
import { addLogger } from './config/logger.js';
import views from './routes/Mongo/view.router.js';
import usersViewRouter from './routes/Mongo/users.views.router.js';
import userRouter from './routes/Mongo/users.router.js';
import productRoutes from './routes/Mongo/product.router.js';
import cartRoutes from './routes/Mongo/cart.router.js';
import ticketRouter from './routes/Mongo/ticket.router.js';
import mockProd from './routes/Mock/mock.router.js';

const app = express();

// ---- COOKIES -----
app.use(cookieParser("L4ClaV3_d3l2023"));

// ---- MIDDLEWARES -----
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
initializePassport();
app.use(passport.initialize());

// ---- handlebars -----
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// ---- SESSIONS -----
app.use(
    session({
        mongoUrl: configEnv.mongoUrl,
        ttl: 60,
        secret: "L4ClaV3_d3l2023",
        resave: true,
        saveUninitialized: false,
    })
);

// ---- ROUTERS -----
app.use("/users", usersViewRouter);
app.use("/carts", views);
app.use("/products", views);
app.use("/mockingproducts", mockProd);
app.use("/api/users", userRouter);
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes);  
app.use("/api/ticket", ticketRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// ---- SWAGGER -----
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "documentación de API, Ecommerce Backend",
            description: "Documentación Técnica"
        }
    },
    apis: ["./src/docs/**/*.yml"]
};
const specs = swaggerJsDoc(swaggerOptions);

// ---- SERVER -----
const PORT = process.env.PORT  || 8080 ;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});