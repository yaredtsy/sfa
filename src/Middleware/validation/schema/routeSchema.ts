import {body} from 'express-validator';

const schema = [
    body('truck_id').isNumeric().notEmpty(),
    body('routeCode').isLength({min:12,max:12}).notEmpty(),
    body('routeName').isString().notEmpty(),
]

export {schema as RouteSchema}