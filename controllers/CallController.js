import { check, validationResult } from 'express-validator'
import {Call, Incidence, } from '../models/index.js'

const createCall = async()=>{

}

const listIncidents = async (req,res)=>{
    try {
        const incidents = await Incidence.findAll();
        res.status(200).json({ incidents });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar las incidencias' });
    }
}

export {
    listIncidents
}