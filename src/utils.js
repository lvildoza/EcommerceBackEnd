// ---- DEPENDENCIAS -----
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from './config/env.config.js';
import nodemailer from 'nodemailer';
import multer from 'multer';
import {fileURLToPath} from 'url';
import { dirname, parse } from 'path';
import {fakerES as faker} from '@faker-js/faker';

// ---- BCRYPT -----
export const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
    bcrypt.compareSync(password, user.password);

// ---- LOCAL FILE -----
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// ---- MULTER -----
function createMulterMiddleware(destination) {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, destination);
            },
            filename: function (req, file, cb) {
                const email = req.params.user;
                const baseName = file.originalname.slice(
                    file.originalname.length - 4
                );
                if (destination === `${__dirname}/public/profile`) {
                    cb(null, `avatar_${email}_${baseName}`);
                } else if (destination === `${__dirname}/public/products`) {
                    cb(null, `prodImg_${email}_${baseName}`);
                } else {
                    cb(null, file.fieldname + `_${email}_${baseName}`);
                }
            },
        }),
        onError: function (err, next) {
            console.log(err);
            next();
        },
    })
};
  
export const upProfileImg = createMulterMiddleware(`${__dirname}/public/profile`);
export const upProdImg = createMulterMiddleware(`${__dirname}/public/products`);
export const upUserDocs = createMulterMiddleware(`${__dirname}/public/documents`);
  
// ---- JWT -----
export const PRIVATE_KEY = envConfig.jwtPrivateKey;

export const generateToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '60s'})
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader){ 
        return res
            .status(401)
            .send({error: 'User not authenticated or missing token'})
    };
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error)
            return res
                .status(403)
                .send({ error: 'Invalid token, access denied' });
        req.user = credentials.user;
        next();
    });
};

// ---- DB PRODUCT FAKE -----
export const generateProducts = () => {
    return{
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alpha(5),
        price: faker.commerce.price(),
        thumbnail: faker.image.avatar(),
        stock: faker.number.int(500),
        available: faker.datatype.boolean(),
    }
};

// ---- NODEMAILER -----
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: envConfig.gmailUser, 
        pass: envConfig.gmailPass,
    }
});