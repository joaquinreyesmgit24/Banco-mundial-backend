import express from 'express'

import { createCompany, listCompanies,updateCompany,listPanels, listSampleSectors, listSampleSizes, deleteCompany} from '../controllers/companyController.js'

const router = express.Router()

router.post('/create-company',createCompany)
router.put('/update-company/:companyId', updateCompany)
router.get('/list-companies', listCompanies)
router.get('/list-panels', listPanels)
router.get('/list-sample-sectors', listSampleSectors)
router.get('/list-sample-sizes', listSampleSizes)
router.delete('/delete-company/:companyId', deleteCompany)

export default router;