import express from 'express'

import { createSurvey} from '../controllers/surveyController.js'

const router = express.Router()

router.post('/create-survey',createSurvey)

export default router;