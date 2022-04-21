import {body} from 'express-validator';

const schema = [
    body('comapny_id').isNumeric().notEmpty(),
    body('city_id').isNumeric().notEmpty(),
    body('outletName').isString().notEmpty(),
    body('ownerName').isString().notEmpty(),
    body('phoneNumber').isMobilePhone('et-EE').notEmpty(),
    body('vatNumber').isNumeric().notEmpty(),
    body('geoLat').isLatLong().notEmpty(),
    body('geoLong').isLatLong().notEmpty(),
    body('route_id').isNumeric().notEmpty(),
    body('channel_id').isNumeric().notEmpty()
]

export {schema as OutletSchema }