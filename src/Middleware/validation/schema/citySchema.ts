import {body} from 'express-validator';

const schema = [
    body('nation_id').isNumeric().notEmpty(),
    body('city').notEmpty(),
    body('subCity').notEmpty(),
    body('specificArea').notEmpty(),

]

export {schema as CitySchema}