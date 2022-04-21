import {body} from 'express-validator';

const schema = [
        body('firstName','firstname must not be empty').isString().notEmpty(),
        body('middleName','middlename must not be empty').isString().notEmpty(),
        body('lastName','lastname must not be empty').isString().notEmpty(),
        body('email').isEmail().notEmpty(),
        body('phoneNumber').isMobilePhone('et-EE').isLength({min:9,max:13}).notEmpty(),
        body('address').isString().notEmpty(),
        body('position').isString().notEmpty(),
]

export {schema as RegistrationSchema}