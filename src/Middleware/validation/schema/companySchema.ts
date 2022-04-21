import {body} from 'express-validator'

const schema = [
    body('nation_id').isNumeric().notEmpty(),
    body('companyCode').isLength({min: 2, max:2}).notEmpty(),
    body('companyName').isString().notEmpty(),
    body('city').isString().notEmpty(),
    body('address').isString().notEmpty(),
    body('numberOfAgents').isNumeric().notEmpty()
]

export { schema as CompanySchema}