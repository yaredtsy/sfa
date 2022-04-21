import {body} from 'express-validator'

const schema = [
    body('territory_id').isNumeric().notEmpty(),
    body('truckCode').isLength({min:9,max:15}),
    body('truckName').isString().notEmpty(),
    body('plateNumber').isLength({min:8,max:9}),
   
]

export {schema as TruckSchema}