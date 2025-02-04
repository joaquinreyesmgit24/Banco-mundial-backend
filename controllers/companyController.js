import { check, validationResult } from 'express-validator'
import {Company, SampleSize, SampleSector, Panel} from '../models/index.js'

const create = async (req,res)=>{
    try{
        await check('code').notEmpty().withMessage('El id de la empresa no puede estar vacio').run(req)
        await check('name').notEmpty().withMessage('El nombre de la empresa no puede estar vacio').run(req)
        await check('sampleLocation').notEmpty().withMessage('La ubicación de la muestra no pueda estar vacia').run(req)
        await check('floorNumber').notEmpty().withMessage('El id de la empresa no puede ir vacio').run(req)
        await check('street').notEmpty().withMessage('El id de la empresa no puede ir vacio').run(req)
        await check('city').notEmpty().withMessage('El id de la empresa no puede ir vacio').run(req)
        await check('state').notEmpty().withMessage('El id de la empresa no puede ir vacio').run(req)
        await check('phoneNumberOne').notEmpty().withMessage('El id de la empresa no puede ir vacio').run(req)
        await check('preferenceNumber').notEmpty().withMessage('El número de preferencia no puede ir vacio').run(req)
        await check('emailAdress').notEmpty().withMessage('El correo de la empresa no puede ir vacio').run(req)

        let result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const { code, name, sampleLocation, floorNumber, street, city, state, phoneNumberOne, phoneNumberSecond, faxNumber, preferenceNumber, emailAdress, panelId} = req.body;
        const companyExists = await Company.findOne({ where: { code } })
        if (companyExists) {
            return res.status(400).json({ error: 'La empresa ya existe' });
        }
        const company = await Company.create( { code, name, sampleLocation, floorNumber, street, city, state, phoneNumberOne, phoneNumberSecond, faxNumber, preferenceNumber, emailAdress, panelId} );
        const companies = await company.findAll({
            include: Role,
            required:true
            });
        res.status(200).json({msg: 'Usuario creado correctamente', user, users })

    }catch(error){
        res.status(500).json({ error: 'Error al crear la empresa'})
    }


}