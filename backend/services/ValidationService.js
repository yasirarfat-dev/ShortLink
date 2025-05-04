import Joi from 'joi';

const urlSchema = Joi.object({
    url: Joi.string().uri().min(10).max(2048).required(),
    alias: Joi.string().alphanum().min(4).max(20).allow(null, '').optional(),
});

export default urlSchema;
