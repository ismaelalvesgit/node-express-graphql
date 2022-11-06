import joi from "joi";

export const createContactSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
});

export const updateContactSchema = joi.object({
    name: joi.string(),
    phone: joi.string(),
}).required().min(1);