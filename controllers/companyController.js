import { check, validationResult } from 'express-validator'
import { Company, SampleSize, SampleSector, Panel,Call, Sequelize } from '../models/index.js'
import moment from 'moment'
import { Op } from 'sequelize';

const createCompany = async (req, res) => {
    try {
        await check('code').notEmpty().withMessage('El id de la empresa no puede estar vacio').run(req)
        await check('rut').notEmpty().withMessage('El rut de la empresa no puede estar vacio').run(req)
        await check('name').notEmpty().withMessage('El nombre de la empresa no puede estar vacio').run(req)
        await check('sampleLocation').notEmpty().withMessage('La ubicación de la muestra no pueda estar vacia').run(req)
        await check('floorNumber').notEmpty().withMessage('El número de casa/piso/puerta de la empresa no puede ir vacio').run(req)
        await check('street').notEmpty().withMessage('La calle de la empresa no puede ir vacio').run(req)
        await check('city').notEmpty().withMessage('La ciudad de la empresa no puede ir vacio').run(req)
        await check('state').notEmpty().withMessage('El estado de la empresa no puede ir vacio').run(req)
        await check('phoneNumberOne').notEmpty().withMessage('El teléfono uno de la empresa no puede ir vacio').run(req)
        await check('preferenceNumber').notEmpty().withMessage('El número de preferencia no puede ir vacio').run(req)
        await check('emailAddress').notEmpty().withMessage('El correo de la empresa no puede ir vacio').run(req)

        await check('callStartTime')
            .notEmpty()
            .withMessage('La hora de inicio de llamada no puede estar vacía')
            .run(req);

        await check('callEndTime')
            .notEmpty()
            .withMessage('La hora de término de llamada no puede estar vacía')
            .run(req);


        let result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        } 
        const { code, rut, name, sampleLocation, floorNumber, street, city, state, phoneNumberOne, numberPhoneCallsOne, phoneNumberSecond, numberPhoneCallsSecond, faxNumber, preferenceNumber, callStartTime, callEndTime, emailAddress, sampleSectorId, sampleSizeId, panelId} = req.body;

        if (callStartTime >= callEndTime) {
            return res.status(400).json({ error: 'La hora de inicio de llamada no puede ser mayor o igual a la hora de término.' });
        }
        const companyExists = await Company.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { code: code },
                    { rut: rut }
                ]
            }
        });

        if (companyExists) {
            return res.status(400).json({ error: 'La empresa ya existe' });
        }

        if (!sampleSectorId) {
            return res.status(400).json({ error: 'Debe seleccionar un sector de la muestra válido' });
        }
        if (!sampleSizeId) {
            return res.status(400).json({ error: 'Debe seleccionar un tamaño de la muestra válido' });
        }
        if (!panelId) {
            return res.status(400).json({ error: 'Debe seleccionar un panel válido' });
        }
        const company = await Company.create({ code, rut, name, sampleLocation, floorNumber, street, city, state, phoneNumberOne, numberPhoneCallsOne, phoneNumberSecond, numberPhoneCallsSecond, faxNumber, preferenceNumber, callStartTime, callEndTime, emailAddress, sampleSectorId, sampleSizeId, panelId, use: false });
        const companies = await Company.findAll({
            include: [
                {
                    model: SampleSize,
                    required: true
                },
                {
                    model: SampleSector,
                    required: true
                },
                {
                    model: Panel,
                    required: true
                }
            ]
        });
        res.status(200).json({ msg: 'Empresa creada correctamente', company, companies })

    } catch (error) {
        res.status(500).json({ error: 'Error al crear la empresa' })
    }
}

const updateCompany = async (req, res) => {
    try {
        await check('code').notEmpty().withMessage('El id de la empresa no puede estar vacio').run(req)
        await check('rut').notEmpty().withMessage('El rut de la empresa no puede estar vacio').run(req)
        await check('name').notEmpty().withMessage('El nombre de la empresa no puede estar vacio').run(req)
        await check('sampleLocation').notEmpty().withMessage('La ubicación de la muestra no pueda estar vacia').run(req)
        await check('floorNumber').notEmpty().withMessage('El número de casa/piso/puerta de la empresa no puede ir vacio').run(req)
        await check('street').notEmpty().withMessage('La calle de la empresa no puede ir vacio').run(req)
        await check('city').notEmpty().withMessage('La ciudad de la empresa no puede ir vacio').run(req)
        await check('state').notEmpty().withMessage('El estado de la empresa no puede ir vacio').run(req)
        await check('phoneNumberOne').notEmpty().withMessage('El teléfono uno de la empresa no puede ir vacio').run(req)
        await check('preferenceNumber').notEmpty().withMessage('El número de preferencia no puede ir vacio').run(req)
        await check('emailAddress').notEmpty().withMessage('El correo de la empresa no puede ir vacio').run(req)

        await check('callStartTime')
        .notEmpty()
        .withMessage('La hora de inicio de llamada no puede estar vacía')
        .run(req);

        await check('callEndTime')
        .notEmpty()
        .withMessage('La hora de término de llamada no puede estar vacía')
        .run(req);

        let result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const { code, rut, name, sampleLocation, floorNumber, street, city, state, phoneNumberOne, numberPhoneCallsOne, phoneNumberSecond, numberPhoneCallsSecond, faxNumber, preferenceNumber, callStartTime, callEndTime, emailAddress, sampleSectorId, sampleSizeId, panelId } = req.body;
        const company = await Company.findOne({ where: { code } })
        if (!company) {
            return res.status(400).json({ error: 'La empresa a actualizar no existe' });
        }
        if (!sampleSectorId) {
            return res.status(400).json({ error: 'Debe seleccionar un sector de la muestra válido' });
        }
        if (!sampleSizeId) {
            return res.status(400).json({ error: 'Debe seleccionar un tamaño de la muestra válido' });
        }
        if (!panelId) {
            return res.status(400).json({ error: 'Debe seleccionar un panel válido' });
        }

        company.code = code
        company.rut = rut
        company.name = name
        company.sampleLocation = sampleLocation
        company.floorNumber = floorNumber
        company.street = street
        company.city = city
        company.state = state
        company.phoneNumberOne = phoneNumberOne
        company.numberPhoneCallsOne= numberPhoneCallsOne
        company.phoneNumberSecond = phoneNumberSecond
        company.numberPhoneCallsSecond = numberPhoneCallsSecond
        company.faxNumber = faxNumber
        company.preferenceNumber = preferenceNumber
        company.callStartTime =callStartTime
        company.callEndTime=callEndTime
        company.emailAdress = emailAddress
        company.sampleSectorId = sampleSectorId
        company.sampleSizeId = sampleSizeId
        company.panelId = panelId

        await company.save();

        const companies = await Company.findAll({
            include: [
                {
                    model: SampleSize,
                    required: true
                },
                {
                    model: SampleSector,
                    required: true
                },
                {
                    model: Panel,
                    required: true
                }
            ]
        });
        res.status(200).json({ msg: 'Empresa actualizada correctamente', company, companies })

    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la empresa' })
    }
}
const listCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll(
            {
                include: SampleSize,
                required: true
            },
            {
                include: SampleSector,
                required: true
            },
            {
                include: Panel,
                required: true
            },
        );
        res.status(200).json({ companies });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar las empresas' });
    }
}
const listPanels = async (req, res) => {
    try {
        const panels = await Panel.findAll();
        res.status(200).json({ panels });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los paneles' });
    }
}
const listSampleSectors = async (req, res) => {
    try {
        const sampleSectors = await SampleSector.findAll();
        res.status(200).json({ sampleSectors });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los sectores de la muestra' });
    }
}
const listSampleSizes = async (req, res) => {
    try {
        const sampleSizes = await SampleSize.findAll();
        res.status(200).json({ sampleSizes });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los tamaños de la muestra' });
    }
}
const deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findOne({ where: { id: companyId } })
        if (!company) {
            return res.status(400).json({ error: 'La empresa no existe' });
        }
        await company.destroy()
        const companies = await Company.findAll(
            {
                include: SampleSize,
                required: true
            },
            {
                include: SampleSector,
                required: true
            },
            {
                include: Panel,
                required: true
            },
        );
        res.status(200).json({ msg: 'Empresa eliminada correctamente', company, companies })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la empresa' });
    }
}
const getRandomEmpresa = async (req, res) => {
    const { userId } = req.params;
    try {
        // Función para verificar si una empresa tiene llamadas disponibles
        const checkCallsAvailability = async (company) => {
            const todayStart = moment().startOf('day').format('YYYY-MM-DD 00:00:00');
            const todayEnd = moment().endOf('day').format('YYYY-MM-DD 23:59:59');

            const callsCount = await Call.findAll({
                where: {
                    date: { [Op.between]: [todayStart, todayEnd] },
                    phone: { [Op.in]: [company.phoneNumberOne, company.phoneNumberSecond] },
                },
                attributes: [
                    'phone',
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalCalls'],
                ],
                group: ['phone'],
                raw: true,
            });
            const callsByPhone = callsCount.reduce((acc, item) => {
                acc[item.phone] = item.totalCalls;
                return acc;
            }, {});

            const callsMadeOne = callsByPhone[company.phoneNumberOne] || 0;
            const callsMadeTwo = callsByPhone[company.phoneNumberSecond] || 0;

            // Aquí estamos comprobando si las llamadas realizadas son menores a las permitidas
            const isPhoneOneAvailable = callsMadeOne < company.numberPhoneCallsOne;
            const isPhoneTwoAvailable = callsMadeTwo < company.numberPhoneCallsSecond;

            // Ambas condiciones deben ser verdaderas para que la empresa esté disponible
            return isPhoneOneAvailable || isPhoneTwoAvailable;
        };

        // Obtener todas las empresas asignadas al usuario con use=true
        const assignedCompanies = await Company.findAll({
            where: { assignedId: userId, use: true },
        });

        if (assignedCompanies.length > 0) {
            // Evaluar disponibilidad de llamadas para las empresas asignadas
            const availabilityResults = await Promise.all(
                assignedCompanies.map((company) => checkCallsAvailability(company))
            );

            // Filtrar las empresas que tienen llamadas disponibles
            const availableAssignedCompanies = assignedCompanies.filter(
                (_, index) => availabilityResults[index]
            );

            if (availableAssignedCompanies.length > 0) {
                // Seleccionar una empresa aleatoria de las disponibles
                const randomAssignedCompany = availableAssignedCompanies[
                    Math.floor(Math.random() * availableAssignedCompanies.length)
                ];
                console.log(randomAssignedCompany);

                return res.json(randomAssignedCompany);
            } else {
                return res.status(404).json({ message: 'No hay empresas asignadas con llamadas disponibles.' });
            }
        }

        // Si no hay empresas asignadas disponibles, buscar nuevas empresas no asignadas
        const newCompanies = await Company.findAll({
            where: { use: false, assignedId: null },
        });

        // Evaluar disponibilidad de llamadas para las nuevas empresas
        const availabilityNewResults = await Promise.all(
            newCompanies.map((company) => checkCallsAvailability(company))
        );

        // Filtrar las empresas que tienen llamadas disponibles
        const availableNewCompanies = newCompanies.filter(
            (_, index) => availabilityNewResults[index]
        );

        if (availableNewCompanies.length > 0) {
            // Seleccionar una empresa aleatoria de las disponibles
            const randomNewCompany = availableNewCompanies[
                Math.floor(Math.random() * availableNewCompanies.length)
            ];

            // Asignar la empresa al encuestador y marcarla como en uso
            randomNewCompany.assignedId = userId;
            randomNewCompany.use = true;
            await randomNewCompany.save();

            return res.json(randomNewCompany);
        } else {
            return res.status(404).json({ message: 'No hay empresas disponibles con llamadas.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener la empresa.' });
    }
}




export {
    createCompany,
    updateCompany,
    listCompanies,
    listPanels,
    listSampleSectors,
    listSampleSizes,
    deleteCompany,
    getRandomEmpresa
}
