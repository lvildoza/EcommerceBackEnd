import {ticketService} from "../services/factory.js";

export const createTicket = async(req, res)=>{
    const data = req.body.cartId;
    try {
        const response = await ticketService.create(data);
        if (response === null) {
            res.status(400).json({ error: 'No hay productos con stock suficiente para crear el ticket.' });
        } else {
            res.send({ status: "200", message: "Ticket creado con exito con ID: " + response.id , payload: response}) 
        }
        
        }catch (error) {
            req.logger.error("Error al crear el ticket del CartId: " + data);
            res.status(500).json({ error: 'Error interno del servidor', details: error.message }); 
        }
    }; 

export const renderTicket = async(req, res)=>{
    const tid = req.params.tid;
    try {
        const ticket =  await ticketService.getTicket(tid);
        if(ticket){
            res.render('ticket', {ticket:ticket})
        } else {
            req.logger.error("Error al obtener el ticket con ID: " + tid);
            res.status(404).json({ error: 'Ticket no encontrado' });
        }
    }catch (error) {
        req.logger.error("Error al obtener el ticket con ID: " + tid);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
}