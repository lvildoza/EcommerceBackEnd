import {userService} from '../services/factory.js';

export  const  registerController = async (req, res) => {
    const { first_name, last_name, email, age, password} = req.body;
    const user = {
        first_name,
        last_name,
        email,
        age,
        password 
    };
    const result = await userService.save(user, res);
    if (result) {
        req.logger.info("Usuario logueado con exito")
        return res.send({ status: "200", message: "Usuario creado, ID: " + result.id, payload: result});
    }else{
        req.logger.error("El usuario ya se encuentra registrado")
        return res.status(401).send({ message: "El usuario ya existe" });
    }
};

export const getAllUsersController = async (req, res) => {
    const data = await userService.getAll();
    res.send(data);
};

export const delAllInactiveUsersController = async (req, res) => {
    const data = await userService.deleteAllInactive();
    res.send(data);
}

export const findOneUserController = async (req, res) => {
    const uid = req.params.uid;
    try {
        const user = await userService.findById({_id:uid})
        if (user) {
            req.logger.info("Usuario encontrado con exito")
            return res.send({status: "200", message: "Usuario encontrado con exito", payload: user});
        }else{
            req.logger.error("Error al buscar el usuario")
            return res.status(401).send({ message: "Usuario no valido" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });    
    };
};

export const deleteUserController = async (req, res) => {
    const uid = req.params.uid;
    try {
        const user = await userService.deleteUser({_id:uid})
        if (user) {
            req.logger.info("Usuario eliminado con exito")
            return res.send({status: "200", message: "Usuario eliminado con exito", payload: user});
        }else{
            req.logger.error("Error al buscar el usuario")
            return res.status(401).send({ message: "Usuario no valido" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });  
        
    }
}

export const updateUserController = async (req, res) => {
    const uid = req.params.uid;
    try {
        const {first_name, last_name, email, age, role, last_connection, documents} = req.body;
        const data = {
            first_name,
            last_name,
            email,
            age,
            role,
            last_connection,
            documents
        }
        const user = await userService.updateUser({_id: uid}, data);
        if (user) {
            req.logger.info("Usuario actualizado con exito")
            return res.send({status: "200", message: "Usuario actualizado con exito", payload: user});
        }else{
            req.logger.error("Error al actualizar el usuario")
            return res.status(401).send({ message: "Usuario no valido" });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
    

}

export const loginController = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userService.login(email, password, res);
            if (user) {
                req.logger.info("Usuario logueado con exito")
                return res.status(200).send({ message: "Usuario valido" }); 
            }else{
                req.logger.error("Usuario no valido, Username o Password incorrecto")
                return res.status(401).send({ message: "Usuario no valido" });
            }
        } catch (error) { 
            res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }   
        
};

export const imgProfileController = async (req, res) => {
    try {
        let email = req.params.user;
    let path = "../profile/"+(req.file.filename)
    const user = await userService.uploadAvatar(email, path);
    if (user) {
        req.logger.info("Imagen de perfil subida con exito")
        return res.status(200).send({ message: "Imagen de perfil subida con exito" }); 
        
    }else{
        req.logger.error("Error al subir la imagen de perfil")
    }  
    }catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

export const userDUController = async (req, res) => {
    try {
        let email = req.params.user;
        let path = "../documents/"+(req.file.filename)
        const user = await userService.uploadDoc(email, path, "DU");
        if (user) {
            req.logger.info("Documento subido con exito")
            return res.status(200).send({ message: "Documento subido con exito" }); 
        }else{
            req.logger.error("Error al subir el documento")
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }



};

export const userCDController = async (req, res) => {
    try {
        let email = req.params.user;
    let path = "../documents/"+(req.file.filename)
    const user = await userService.uploadDoc(email,path, "CD");
    if (user) {
        req.logger.info("Documento subido con exito")
        return res.status(200).send({ message: "Documento subido con exito" }); 
    }else{
        req.logger.error("Error al subir el documento")
    };
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

export const userECController = async (req, res) => {
    try {
        let email = req.params.user;
        let path = "../documents/"+(req.file.filename)
        const user = await userService.uploadDoc(email,path,"EC");
        if (user) {
            req.logger.info("Documento subido con exito")
            return res.status(200).send({ message: "Documento subido con exito" }); 
        }else{
            req.logger.error("Error al subir el documento")
        };    
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
}

export const logAuthenticate = async (req, res) => {
    let page = parseInt(req.query.page);
    if(req.user.role === 'admin'){
        await userService.loginAdmin(req, res)
    }else{
        if (!page) page = 1;
        await userService.loginShowProducts(page, req, res)
    }
};

export const gitHubCallbackController = async (req, res) => {
    const user = req.user;
    await userService.gitHubLogin(user, res);
}

export const logoutController = async (req, res) => {
    await userService.logout('jwtCookieToken', res);   
}