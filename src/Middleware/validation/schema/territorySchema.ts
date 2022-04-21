import {body} from 'express-validator';

const schema = [
    body('region_id').isNumeric().notEmpty(),
    body('territoryCode').isLength({min:9,max:10}).notEmpty(),
    body('territoryName').isString().notEmpty(),
]

export {schema as TerritorySchema}