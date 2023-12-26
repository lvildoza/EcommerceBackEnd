import { Router } from 'express';
import {registerController, loginController, logoutController, gitHubCallbackController, getAllUsersController, updateUserController, findOneUserController, deleteUserController, imgProfileController,delAllInactiveUsersController, userDUController, userCDController, userECController, /* imgProdController */} from "../../controllers/user.controller.js";
import passport from 'passport';
import { upProdImg, upProfileImg, upUserDocs } from '../../utils.js';

const router = Router();

router.post("/register", registerController );
router.put('/update/:uid', updateUserController)
router.get('/findOne/:uid', findOneUserController)
router.delete('/deleteOne/:uid', deleteUserController)
router.get('/allUsers', getAllUsersController )
router.delete('/inactiveUsers', delAllInactiveUsersController )
router.post('/login', loginController)
router.get('/logout', logoutController)
router.post('/uploadAvatar/:user', upProfileImg.single('file'), imgProfileController)
router.post('/uploadDocs/du/:user', upUserDocs.single('du'), userDUController)
router.post('/uploadDocs/cd/:user', upUserDocs.single('cd'), userCDController)
router.post('/uploadDocs/ec/:user', upUserDocs.single('ec'), userECController)
router.get('/github', passport.authenticate('github', {scope: ['user:email']}))
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/github/error'}),gitHubCallbackController)
router.get('/error', (req, res) => {
    res.render('error', {error: "No se pudo autenticar el usuario usando GitHub"})
});
router.get("/fail-register", (req, res) => {
    res.status(401).send({ status: "error", message: "Error al registrar el usuario" })
})
router.get("/fail-login", (req, res) => {
    res.status(401).send({ status: "error", message: "Error al loguear el usuario" })
})

router.get('/private/:role', auth, (req, res) =>{
    res.render('admin')
});

router.get('/premium/:uid', )

function auth(req, res, next){
    const role = req.params.role;
    if (role === "admin") {
        return next();
    } else{
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
}

export default router;