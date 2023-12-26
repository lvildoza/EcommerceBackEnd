import express from 'express';
import { creatNewCart, searchCart, putProductToCart, deleteProductFromCart, cleanCart, downQuantity, renderCart, deleteCart } from '../../controllers/cart.controller.js';
import { createTicket } from '../../controllers/ticket.controller.js';

const router = express.Router();
router.post('/', creatNewCart);
router.get ('/search/:cid', searchCart);
router.put('/:cid/products/add/:pid', putProductToCart);
router.delete('/:cid/products/reduce/:pid', downQuantity);
router.delete('/:cid/products/delete/:pid', deleteProductFromCart);
router.put('/:cid/clean', cleanCart);
router.delete('/deleteCart/:cid', deleteCart);
router.get('/:cid', renderCart)
router.post('/:cid/purchase', createTicket);

export default router;