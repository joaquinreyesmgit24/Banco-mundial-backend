import express from 'express'

import {listIncidents } from '../controllers/CallController.js'
import {getRandomEmpresa} from '../controllers/companyController.js'

const router = express.Router()

router.get('/list-incidents', listIncidents)
router.get('/get-random-company/:userId', getRandomEmpresa)


export default router;