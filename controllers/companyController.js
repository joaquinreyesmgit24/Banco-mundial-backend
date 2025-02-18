import { check, validationResult } from 'express-validator'
import { Company, SampleSize, SampleSector, Panel, Sequelize } from '../models/index.js'

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
       
        const { code, rut, name, sampleLocation, floorNumber, street, city, state, phoneNumberOne, numberPhoneCallsOne, phoneNumberSecond, numberPhoneCallsSecond, faxNumber, preferenceNumber, callStartTime, callEndTime, emailAddress, sampleSectorId, sampleSizeId, panelId } = req.body;

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
    const { userId } = req.params
    try {
        const randomAssignedCompany = await Company.findOne({
            where: { assignedId: userId, use: true },
            order: Sequelize.literal('RAND()'),
        });

        if (randomAssignedCompany) {
            return res.json(randomAssignedCompany);
        }

        const newCompany = await Company.findOne({
            where: { use: false, assignedId: null },
            //   order: Sequelize.literal('RAND()'),
        });

        if (!newCompany) {
            return res.status(404).json({ message: 'No hay empresas disponibles.' });
        }

        // Asignar la empresa al encuestador y marcarla como en uso
        newCompany.assignedId = userId;
        newCompany.use = true;
        await newCompany.save();

        res.json(newCompany);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la empresa.' });
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
