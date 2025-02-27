import { check, validationResult } from 'express-validator'
import {Call, Incidence, Company, Rescheduled, Sequelize} from '../models/index.js'
import db from '../config/db.js'
import moment from 'moment'
import { Op } from 'sequelize';

const createCall = async (req, res) => {
    const t = await db.transaction(); // Iniciar transacción
    try {
        await check('phone').notEmpty().withMessage('El teléfono no ha sido seleccionado').run(req);
        await check('date').notEmpty().withMessage('La fecha no es válida').run(req);

        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { phone, comment, date, companyId, incidenceId, rescheduled } = req.body;

        if (!companyId) {
            return res.status(400).json({ error: 'La empresa no es válida' });
        }

        if (!incidenceId) {
            return res.status(400).json({ error: 'Debe seleccionar una incidencia' });
        }

        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(400).json({ error: 'La empresa no existe' });
        }

        const todayStart = moment().startOf('day').format('YYYY-MM-DD 00:00:00');
        const todayEnd = moment().endOf('day').format('YYYY-MM-DD 23:59:59');

        const callsCount = await Call.findAll({
            where: {
                date: { [Op.between]: [todayStart, todayEnd] },
                phone: { [Op.in]: [company.phoneNumberOne, company.phoneNumberSecond] }
            },
            attributes: [
                'phone',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalCalls']
            ],
            group: ['phone'],
            raw: true
        });

        const callsByPhone = callsCount.reduce((acc, item) => {
            acc[item.phone] = item.totalCalls;
            return acc;
        }, {});

        const callsMadeOne = callsByPhone[company.phoneNumberOne] || 0;
        const callsMadeTwo = callsByPhone[company.phoneNumberSecond] || 0;

        if (phone === company.phoneNumberOne && callsMadeOne >= company.numberPhoneCallsOne) {
            return res.status(400).json({ error: 'No hay llamadas disponibles para este número de teléfono' });
        } else if (phone === company.phoneNumberSecond && callsMadeTwo >= company.numberPhoneCallsSecond) {
            return res.status(400).json({ error: 'No hay llamadas disponibles para este número de teléfono' });
        } else if (phone !== company.phoneNumberOne && phone !== company.phoneNumberSecond) {
            return res.status(400).json({ error: 'El número de teléfono no coincide con los números registrados' });
        }

        // Crear la llamada dentro de la transacción
        const callCreate = await Call.create({ phone, comment, date, companyId, incidenceId }, { transaction: t });

        // Si incidenceId es 3, crear también el registro en Rescheduled

        if (incidenceId == 3) {
            const rescheduledCreate = await Rescheduled.create({ callId: callCreate.id, date:rescheduled.date, time:rescheduled.time }, { transaction: t });
        }

        // Confirmar la transacción si todo está bien
        await t.commit();

        // Obtener todas las llamadas con su incidencia
        const calls = await Call.findAll({
            include: [{ model: Incidence, required: true }]
        });

        if (incidenceId == 2) {
            return res.status(200).json({ msg: 'Se ha guardado correctamente la incidencia', callCreate, calls });
        }
        if (incidenceId == 1) {
            return res.status(200).json({ msg: 'Se ha empezado la encuesta', callCreate, calls });
        }
        if (incidenceId == 3) {
            return res.status(200).json({ msg: 'Se ha reprogramado la llamada', callCreate, rescheduled, calls });
        }
    } catch (error) {
        await t.rollback(); // Revertir transacción en caso de error
        console.error(error);
        return res.status(500).json({ error: 'Error al registrar la llamada' });
    }
};
const listIncidents = async (req,res)=>{
    try {
        const incidents = await Incidence.findAll();
        res.status(200).json({ incidents });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar las incidencias' });
    }
}

const listCallsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ error: 'Falta el ID de la compañía' });
        }

        const calls = await Call.findAll({
            where: { companyId }, // Filtra por empresa
            include: [
                {
                    model: Incidence,
                    required: true // Si quieres que las llamadas sin incidencia también aparezcan
                },
            ]
        });
        res.status(200).json({ calls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al listar las llamadas' });
    }
};
const deleteCall = async (req,res)=>{
    try{
        const {companyId, callId} = req.params;
        
        if (!companyId) {
            return res.status(400).json({ error: 'Falta el ID de la compañía' });
        }
        console.log(companyId, callId)
        const call = await Call.findOne({ where: { id:callId } })

        if (!call) {
            return res.status(400).json({ error: 'La llamada no existe' });
        }
        const deleted =  await call.destroy()
        console.log(`Registros eliminados: ${deleted}`);

        const calls = await Call.findAll({
            where: { companyId }, // Filtra por empresa
            include: [
                {
                    model: Incidence,
                    required: true // Si quieres que las llamadas sin incidencia también aparezcan
                },
            ]
        });

        res.status(200).json({ msg: 'Llamada eliminada correctamente', calls })
    } catch(error){
        res.status(500).json({ error: 'Error al eliminar al usuario' });
    }
}

export {
    listIncidents,
    createCall,
    listCallsByCompany,
    deleteCall
}