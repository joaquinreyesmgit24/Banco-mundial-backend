import express from 'express'

import {listIncidents, createCall, listCallsByCompany, deleteCall, listRescheduledByUserId } from '../controllers/CallController.js'
import {getRandomEmpresa} from '../controllers/companyController.js'

const router = express.Router()

router.post('/create-call', createCall)
router.get('/list-incidents', listIncidents)
router.get('/get-random-company/:userId', getRandomEmpresa)
router.get('/list-calls/:companyId', listCallsByCompany)
router.delete('/delete-call/:companyId/:callId', deleteCall)
router.get('/list-rescheduled-by-user/:userId', listRescheduledByUserId)



export default router;