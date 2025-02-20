import { check, validationResult } from 'express-validator'
import {Call, Incidence, Company, Sequelize} from '../models/index.js'
import moment from 'moment'
import { Op } from 'sequelize';

const createCall = async (req, res) => {
    try {
        await check('phone').notEmpty().withMessage('El teléfono no ha sido seleccionado').run(req);
        await check('date').notEmpty().withMessage('La fecha no es válida').run(req);

        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { phone, comment, date, companyId, incidenceId } = req.body;


        if (!companyId) {
            return res.status(400).json({ error: 'La empresa no es válida' });
        }

        if (!incidenceId) {
            return res.status(400).json({ error: 'Debe seleccionar una incidencia' });
        }

        const company = await Company.findByPk(companyId); // Buscar la empresa

        if (!company) {
            return res.status(400).json({ error: 'La empresa no existe' });
        }

        const todayStart = moment().startOf('day').format('YYYY-MM-DD 00:00:00');
        const todayEnd = moment().endOf('day').format('YYYY-MM-DD 23:59:59');

        // Contar llamadas del día actual para cada número de teléfono
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
        // Convertir resultados en un objeto para fácil acceso
        const callsByPhone = callsCount.reduce((acc, item) => {
            acc[item.phone] = item.totalCalls;
            return acc;
        }, {});


        // Obtener la cantidad de llamadas ya realizadas hoy
        const callsMadeOne = callsByPhone[company.phoneNumberOne] || 0;
        const callsMadeTwo = callsByPhone[company.phoneNumberSecond] || 0;

        // Verificar disponibilidad de llamadas según el teléfono ingresado
        if (phone === company.phoneNumberOne) {
            if (callsMadeOne >= company.numberPhoneCallsOne) {
                return res.status(400).json({ error: 'No hay llamadas disponibles para este número de teléfono' });
            }
        } else if (phone === company.phoneNumberSecond) {
            if (callsMadeTwo >= company.numberPhoneCallsSecond) {
                return res.status(400).json({ error: 'No hay llamadas disponibles para este número de teléfono' });
            }
        } else {
            return res.status(400).json({ error: 'El número de teléfono no coincide con los números registrados' });
        }

        // Si hay llamadas disponibles, se crea la llamada
        const call = await Call.create({ phone, comment, date, companyId, incidenceId });

        const calls = await Call.findAll({
            include: [
                {
                    model: Incidence,
                    required: true
                },
            ]
        });

        if (incidenceId == 2) {
            return res.status(200).json({ msg: 'Se ha guardado correctamente la incidencia', call, calls });
        }
        if (incidenceId == 1) {
            return res.status(200).json({ msg: 'Se ha empezado la encuesta', call, calls });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al registrar la llamada' });
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