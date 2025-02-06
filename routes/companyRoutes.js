import express from 'express'

import { createCompany, listCompanies,updateCompany,listPanels, listSampleSectors, listSampleSizes} from '../controllers/companyController.js'

const router = express.Router()

router.post('/create-company',createCompany)
router.post('/update-company/:companyId', updateCompany)
router.get('/list-companies', listCompanies)
router.get('/list-panels', listPanels)
router.get('/list-sample-sectors', listSampleSectors)
router.get('/list-sample-sizes', listSampleSizes)


export default router;