import { Survey } from '../models/index.js';

const createSurvey = async (req, res) => {
    try {
        // Extraer datos después de la validación y convertir valores vacíos a null o números
        const {
            Q_S10, Q_S8, Q_S9, Q_S4, Q_S7, Q_A7, Q_A7A, Q_A7B, Q_A11, Q_A7C,
            Q_A7D_address, Q_A7D_estab_name, Q_A9, Q_S12_date, Q_S12_hour,
            Q_S12_inter_name, Q_S12_inter_cargo, companyId
        } = req.body;

        // Convertir valores a números o null si es necesario
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

        // Lógica para rechazar la encuesta en ciertos casos
        if (
            surveyData.Q_S10 === 2 || 
            surveyData.Q_S8 === 1 || 
            surveyData.Q_S9 === 1 || 
            surveyData.Q_S4 === -9 || 
            (surveyData.Q_S7 !== null && surveyData.Q_S7 < 5) || 
            (surveyData.Q_A7C === 2 && surveyData.Q_A11 === 1)
        ) {
            surveyData.status = 'Rechazada';
            await Survey.create(surveyData);
            return res.status(200).json({ msg: 'Encuesta procesada correctamente' });
        }

        // Si no fue rechazada, guardar la encuesta con estado 'Confirmada'
        await Survey.create(surveyData);
        res.status(200).json({ msg: 'Encuesta procesada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
export { createSurvey };