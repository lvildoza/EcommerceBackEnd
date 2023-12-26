import userModel from "./models/userModel.js";
import {ProductModel }from "./models/productModel.js";
import { createHash } from '../../../utils.js';
import { isValidPassword } from '../../../utils.js';
import { generateToken } from '../../../utils.js';
import envConfig from '../../../config/env.config.js';
import CartServices from "./cart.services.js";
import UserDto from "../Dto/user.dto.js";
import UserUpdt from "../Dto/userUpdt.dto.js";
import { transporter } from "../../../utils.js";

const cartServices = new CartServices();

const PORT = envConfig.port

export default class UserService {

    getAll = async () => {
        let users = await userModel.find();
        let usersDto = users.map(user => new UserDto(user));
        return usersDto;
    };

    save = async (data) => {    
        try {
            const exists = await userModel.findOne({ email:data.email });
            if (exists) {
                return null;
            };
            data.password = createHash(data.password); 
            let user = await userModel.create(data);
            const userId = user._id.toString();
            const  body  = {
                userId,
                products: [],
            }
            let cart = await cartServices.createCart(body);

            if (cart && user) {
                user.carts.push({ "cart": cart._id});
                await user.save();
                return user;
            
            } else {
                return null;
            }
        } catch (error) {
            throw new Error("Error en la creación del usuario: " + error.message);       
        }
    };

    login = async (email, password, res) => {
        try {
            const exists = await userModel.findOne({ email });
            const isValid = isValidPassword(exists, password);
            if(!exists || !isValid){  
                return null
            }else{
                let cartData = await cartServices.getCartById(exists.carts[0].cart._id)
                let userUpdate = await userModel.updateOne({email: email}, {last_connection: new Date()})
                const tokenUser = {
                name: `${exists.first_name} ${exists.last_name}`,
                email: exists.email,
                role: exists.role,
                img_profile: exists.img_profile,
                cart: exists.carts[0].cart._id,
                cartLength: cartData.products.length
            };
            const accessToken = generateToken(tokenUser);
            res.cookie('jwtCookieToken', accessToken, {
                maxAge: 60000,  
                httpOnly: true,
            })  
            return true
            }           
        } catch (error) {
            throw new Error("Error al validar usuario" + error.message);
        }
    };

    logout = async (cookieName, res) => {
        res.clearCookie(cookieName);
        return res.send({ message: 'Logout exitoso' });
    };
    
    gitHubLogin = async (user, res) => {
        let cartData = await cartServices.getCartById(user.carts[0].cart._id)
        const tokenUser = {
            name: `${user.first_name}`,
            email: user.email,
            role: user.role,
            cart: user.carts[0].cart._id,
            cartLength: cartData.products.length
        };
        const accessToken = generateToken(tokenUser)
        res.cookie('jwtCookieToken', accessToken, {
            maxAge: 60000,  
            httpOnly: true,
        })
    
        res.redirect('/users');
    };

    loginShowProducts = async (page, req ,res) => {
        let result = await ProductModel.paginate({}, {page, lean: true });
            let prevLink = result.hasPrevPage ? `http://localhost:${PORT}/users?page=${result.prevPage}` : '';
            let nextLink = result.hasNextPage ? `http://localhost:${PORT}/users?page=${result.nextPage}` : '';
            let isValid = !(result.page <= 0 || result.page > result.totalPages)
    
            return res.render('profile', {user: req.user,  result, prevLink, nextLink, isValid })            
    };

    loginAdmin = async (req, res) => {
        let isAdmin = true
        return res.render('profile', {user: req.user, isAdmin})            
    };

    updateUser = async (id, user) => {
        let result = await userModel.updateOne(id, user);
        if (result){
            return result;
        }
        else{
            return null
        }
    };

    findById = async (id) => {
        let result = await userModel.findOne(id );
        let userDto = new UserUpdt (result);
        return userDto;
    };

    deleteUser = async (id) => {
        let result = await userModel.deleteOne(id);
        if (result){
            return result;
        }
        else{
            return null
        }
    };

    deleteAllInactive = async () => {
        const fechaActual = new Date();
        const users = await userModel.find();
        const usersInactive = users.filter(user => {
            const fechaUltimaConexion = new Date(user.last_connection);
            const diff = fechaActual - fechaUltimaConexion;
            const minutos = Math.floor(diff / (1000 * 60));
            return minutos > 60;
        })
        for (const user of usersInactive) {
            const mailOptions = {
            from: envConfig.gmailUser,
            to: user.email,
            subject: `Hola ${user.first_name}, tu cuenta ha sido eliminada`,
            text: `Su cuenta ha sido eliminada por inactividad. Por politicas de la empresa si la cuenta esta más de 48 hs sin movimientos se elimina de forma automatica.
            
            Esperamos verte pronto.
            Saludos`,
            };
            transporter.sendMail(mailOptions,(error, info)=>{
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.messageId);
                }
            });
        };
        const result =  await userModel.deleteMany({_id: {$in: usersInactive.map(user => user._id)}});
        if (result){
            return result;
        }
        else{
            return null
        }
    };

    uploadAvatar = async (email, path) => {
        let userUpdate = await userModel.updateOne({email: email}, {img_profile: path})
        if (userUpdate){
            return userUpdate;
        }
        else{
            return null
        }
    };

    uploadDoc = async (email, path, docName) => {
        const exists = await userModel.findOne({ email });
        const docs = exists.documents;
        const duExists = docs.some(doc => doc.name === docName);
        const names = ["DU", "EC", "CD"];        
    
        async function premium () {
            const exists = await userModel.findOne({ email: email });
            const docs = exists.documents;
            return docs.filter((objeto) => {
                return names.includes(objeto.name);
            }).length === 3;
            };

        if (duExists) {
            let delDoc = await userModel.updateOne({ email: email },
                { $pull: { documents: { name: docName } } });
            let user = await userModel.updateOne({ email: email },
                { $push: { documents: { name: docName, reference: path, status: true } } })

            return user
        }else{
            let user = await userModel.updateOne({ email: email     },
            { $push: { documents: { name: docName, reference: path, status: true } } })
            if (user) {
                const isPremium = await premium();
                if (isPremium) {
                    await userModel.updateOne({ email },
                        { $set: { role: "premium" } });
                }
            }
            return user
        };
    };
}