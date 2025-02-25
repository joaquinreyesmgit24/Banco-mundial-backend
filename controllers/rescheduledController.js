import { check, validationResult } from 'express-validator'

const createRescheduled = async (req, res) => {
    try {
        await check('date').notEmpty().withMessage('La fecha no puede ir vacía').run(req)
        await check('time').notEmpty().withMessage('La hora no puede ir vacía').run(req)
        
        let result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        } 
        const { date, time} = req.body;

        res.status(200).json({ msg: 'Empresa creada correctamente', company, companies })

    } catch (error) {
        res.status(500).json({ error: 'Error al crear la empresa' })
    }
}