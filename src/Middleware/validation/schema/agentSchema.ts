import {body} from 'express-validator'

const schema = [
    body('agentName').isString().notEmpty(),
    body('agentCode').isString().notEmpty(),
    body('address').isString().notEmpty(),
    body('company_id').isNumeric().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('phoneNumber').isMobilePhone('et-EE').notEmpty(),
    body('region_id').isNumeric().notEmpty()
]

export {schema as AgentSchema}