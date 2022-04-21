import {body} from 'express-validator'

const schema = [
    body('company_id').isNumeric().notEmpty(),
    body('regionCode').isLength({min:5,max:6}).notEmpty(),
    body('regionName').isString().notEmpty(),

]

export { schema as RegionSchema }