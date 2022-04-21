import {body} from 'express-validator'

const schema = [
    body('channelName').isString().notEmpty()
]

export {schema as ChannelSchema}