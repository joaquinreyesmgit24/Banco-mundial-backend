import { check, validationResult } from 'express-validator'
import { Survey } from '../models/index.js'

const createCompany = async (req, res) => {
    try {
        // Ejecutar todas las validaciones primero
        await Promise.all([
            check('Q_S10').notEmpty().withMessage('La pregunta S.10 no puede estar vacía').run(req),
            check('Q_S8').notEmpty().withMessage('La pregunta S.8 no puede estar vacía').run(req),
            check('Q_S9').notEmpty().withMessage('La pregunta S.9 no puede estar vacía').run(req),
            check('Q_S4').notEmpty().withMessage('La pregunta S.4 no puede estar vacía').run(req),
            check('Q_S7').notEmpty().withMessage('La pregunta S.7 no puede estar vacía').run(req),
            check('Q_A7').notEmpty().withMessage('La pregunta A.7 no puede estar vacía').run(req),
            check('Q_A7A').notEmpty().withMessage('La pregunta A.7A no puede estar vacía').run(req),
            check('Q_A7B').notEmpty().withMessage('La pregunta A.7B no puede estar vacía').run(req),
            check('Q_A11').if(req.body.Q_A7B == 1).notEmpty().withMessage('La pregunta A.11 no puede estar vacía').run(req),
            check('Q_A7C').if(req.body.Q_A7B == 1).notEmpty().withMessage('La pregunta A.7C no puede estar vacía').run(req),
            check('Q_A7D_address').if(req.body.Q_A7B == 1).notEmpty().withMessage('La dirección no puede estar vacía').run(req),
            check('Q_A7D_estab_name').if(req.body.Q_A7B == 1).notEmpty().withMessage('El nombre del establecimiento no puede estar vacío').run(req),
            check('Q_A9').notEmpty().withMessage('La pregunta A.9 no puede estar vacía').run(req),
            check('Q_S12_date').notEmpty().withMessage('La fecha de la cita no puede ir vacía').run(req),
            check('Q_S12_hour').notEmpty().withMessage('La hora de la cita no puede ir vacía').run(req),
            check('Q_S12_inter_name').notEmpty().withMessage('El nombre del entrevistado no puede ir vacío').run(req),
            check('Q_S12_inter_cargo').notEmpty().withMessage('El cargo del entrevistado no puede ir vacío').run(req),
        ]);

        // Verificar si hay errores de validación antes de continuar
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        // Extraer datos después de la validación
        const { Q_S10, Q_S8, Q_S9, Q_S4, Q_S7, Q_A7, Q_A7A, A7A_cant_val, Q_A7B,
            Q_A11, Q_A7C, Q_A7D_address, Q_A7D_estab_name, Q_A9, Q_S12_date,
            Q_S12_hour, Q_S12_inter_name, Q_S12_inter_cargo } = req.body;

        // Lógica para rechazar la encuesta en ciertos casos
        if (Q_S10 == 2 || Q_S8 == 1 || Q_S9 == 1 || Q_S4 == -9 || Q_S7 < 5 ||
            (Q_A7C == "2" && Q_A11 == "1")) {
            await Survey.create({ Q_S10, Q_S8, Q_S9, Q_S4, Q_S7, Q_A7, Q_A7A, A7A_cant_val, Q_A7B, Q_A11, Q_A7C, status: 'Rechazada' });
            return res.status(200).json({ message: 'Encuesta rechazada' });
        }
        else{
            await Survey.create({ Q_S10, Q_S8, Q_S9, Q_S4, Q_S7, Q_A7, Q_A7A, A7A_cant_val, Q_A7B, Q_A11, Q_A7C,Q_A7D_address, Q_A7D_estab_name, Q_A9, Q_S12_date,
                Q_S12_hour, Q_S12_inter_name, Q_S12_inter_cargo, status: 'Confirmada' })
        }
        // Si todas las validaciones pasan y la encuesta no está rechazada, podrías continuar con la lógica para guardar la encuesta como válida.
        res.status(200).json({ message: 'Encuesta procesada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export {
    createCompany
}