import express from 'express'

import {listIncidents, createCall, listCallsByCompany } from '../controllers/CallController.js'
import {getRandomEmpresa} from '../controllers/companyController.js'

const router = express.Router()

router.post('/create-call', createCall)
router.get('/list-incidents', listIncidents)
router.get('/get-random-company/:userId', getRandomEmpresa)
router.get('/list-calls/:companyId', listCallsByCompany)


export default router;