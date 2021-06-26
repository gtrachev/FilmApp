const Joi = require('joi');

module.exports.registerJoiSchema = Joi.object({
    username: Joi.string().alphanum().min(1).max(20).required(),
    password: Joi.string().min(4).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'bg', 'org'] } }).required()
})

module.exports.loginJoiSchema = Joi.object({
    username: Joi.string().alphanum().min(1).max(20).required(),
    password: Joi.string().min(4).required()
})