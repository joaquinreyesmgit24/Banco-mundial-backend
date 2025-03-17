import { Op } from 'sequelize';
import db from '../config/db.js';
import { Survey, Report, Company, SampleSector, SampleSize, Country, Region, Panel } from '../models/index.js';

const createSurvey = async (req, res) => {
    const t = await db.transaction();
    try {
        const {
            Q_S10, Q_S8, Q_S9, Q_S4, Q_S7, Q_A7, Q_A7A, Q_A7B, Q_A11, Q_A7C,
            Q_A7D_address, Q_A7D_estab_name, Q_A9, Q_S12_date, Q_S12_hour,
            Q_S12_inter_name, Q_S12_inter_cargo, companyId, selectedMainStatus, selectedSubStatus
        } = req.body;

        const company = await Company.findByPk(companyId, {
            include: [
                { model: SampleSize, attributes: ['code', 'description'] },
                { model: SampleSector, attributes: ['code', 'description'] },
                { model: Country, attributes: ['name', 'code'] },
                { model: Region, attributes: ['name', 'code'] },
                { model: Panel, attributes: ['code', 'description'] },
            ]
        });

        if (!company) {
            return res.status(404).json({ msg: 'Compañía no encontrada' });
        }

        const surveyData = {
            Q_S10: Q_S10 ? parseInt(Q_S10) : null,
            Q_S8: Q_S8 ? parseInt(Q_S8) : null,
            Q_S9: Q_S9 ? parseInt(Q_S9) : null,
            Q_S4: Q_S4 ? parseInt(Q_S4) : null,
            Q_S7: Q_S7 ? parseInt(Q_S7) : null,
            Q_A7: Q_A7 ? parseInt(Q_A7) : null,
            Q_A7A: Q_A7A ? parseInt(Q_A7A) : null,
            Q_A7B: Q_A7B ? parseInt(Q_A7B) : null,
            Q_A11: Q_A11 ? parseInt(Q_A11) : null,
            Q_A7C: Q_A7C ? parseInt(Q_A7C) : null,
            Q_A7D_address: Q_A7D_address || null,
            Q_A7D_estab_name: Q_A7D_estab_name || null,
            Q_A9: Q_A9 ? parseInt(Q_A9) : null,
            Q_S12_date: Q_S12_date || null,
            Q_S12_hour: Q_S12_hour || null,
            Q_S12_inter_name: Q_S12_inter_name || null,
            Q_S12_inter_cargo: Q_S12_inter_cargo || null,
            companyId: companyId ? parseInt(companyId) : null,
            status: 'Confirmada'
        };

        // Asignación del eligibilityCode
        let eligibilityCode = "";
        if (surveyData.Q_S10 === 2) eligibilityCode = "153";
        else if (surveyData.Q_S8 === 1) eligibilityCode = "8";
        else if (surveyData.Q_S9 === 1) eligibilityCode = "72";
        else if (surveyData.Q_S4 === -9) eligibilityCode = "8";
        else if (surveyData.Q_S7 !== null && surveyData.Q_S7 < 5) eligibilityCode = "5";
        else if (surveyData.Q_A11 === 1 && surveyData.Q_A7C === 2) eligibilityCode = "154";
        else if (surveyData.Q_A9 === 2) eligibilityCode = "157";

        // Lógica para cambiar el estado de la encuesta si es rechazada
        if (eligibilityCode !== "") {
            surveyData.status = 'Inelegible';
        }

        // Crear encuesta dentro de una transacción
        const survey = await Survey.create(surveyData, { transaction: t });

        const reportData = {
            countryName: company.country.name,
            countryCode: company.country.code,
            nameStratificationRegion: company.region.name,
            regionalStratificationCode: company.region.code,
            nameSizeStratification: company.sampleSize.description,
            sizeStratificationCode: company.sampleSize.code,
            nameStratificationSector: company.sampleSector.description,
            sectorStratificationCode: company.sampleSector.code,
            panelName: company.panel.description,
            panelCode: company.panel.code,
            eligibilityCode,
            statusCode: "",
            rejectionCode: "",
            companyName: company.name,
            locality: "",
            address: company.street,
            zipCode: company.zipCode,
            contactPerson: "",
            contactPosition: "",
            phoneNumberOne: company.phoneNumberOne,
            phoneNumberSecond: company.phoneNumberSecond || "",
            faxNumber: company.faxNumber,
            emailAddress: company.emailAddress,
            web: company.web,
            companyId: company.id
        };
        if (selectedMainStatus) {
            reportData.statusCode = selectedMainStatus;
        }
        if(selectedSubStatus){
            reportData.rejectionCode = selectedSubStatus;
        }
        // Crear reporte dentro de la misma transacción
        await Report.create(reportData, { transaction: t });

        // Confirmar la transacción
        await t.commit();
        res.status(200).json({ msg: 'Encuesta procesada correctamente' });

    } catch (error) {
        // Hacer rollback en caso de error
        await t.rollback();
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};


export { createSurvey };
