import {body} from 'express-validator';

const schema = [
    body('comapny_id').isNumeric().notEmpty(),
    body('brandType').isString().notEmpty(),
    body('brandName').isString().notEmpty(),
    body('unitPrice').isFloat().notEmpty(),
    body('description').isString().notEmpty(),
    body('sku').isString().notEmpty()
]

export { schema as MaterialSchema }