import { check, validationResult } from 'express-validator'
import {Call, Incidence, } from '../models/index.js'

const createCall = async(req,res)=>{
    try{
        await check('phone').notEmpty().withMessage('El teléfono no ha sido seleccionado').run(req)
        await check('date').notEmpty().withMessage('La fecha no es válida').run(req)
        
        let result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const { phone, comment,date, companyId, incidenceId} = req.body;


        if(!companyId){
            return res.status(400).json({ error: 'La empresa no es válida' });
        }


        if(!incidenceId){
            return res.status(400).json({ error: 'Debe seleccionar una incidencia' });
        }

        const call = await Call.create( {phone, comment,date, companyId, incidenceId} );

        const calls = await Call.findAll({
            include: [
                {
                    model: Incidence,
                    required: true
                },
                
            ]
        });
        if(incidenceId==2){
            res.status(200).json({msg: 'Se ha guardado correctamente la incidencia', call, calls })
        }
        if(incidenceId==1){
            res.status(200).json({msg: 'Se ha empezado la encuesta', call, calls })
        }

    }catch(error){
        res.status(500).json({ error: 'Error al crear la empresa'})
    }
}

const listIncidents = async (req,res)=>{
    try {
        const incidents = await Incidence.findAll();
        res.status(200).json({ incidents });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar las incidencias' });
    }
}

const listCallsByCompany = async (req,res)=>{
    try {
        const companyId = req.params.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'Falta el ID de la compañía' });
        }

        const calls = await Call.findAll({
            include: [
                {
                    model: Incidence,
                    required: true
                },
                
            ]
        });

        if (calls.length === 0) {
            return res.status(404).json({ message: 'No se encontraron llamadas para esta empresa' });
        }
        res.status(200).json({ calls });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar las llamadas' });
    }
}

export {
    listIncidents,
    createCall,
    listCallsByCompany
}