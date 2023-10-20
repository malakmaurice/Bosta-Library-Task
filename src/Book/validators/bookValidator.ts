import Joi from "joi";
export const addBookValidator = Joi.object().keys({
  title: Joi.string().required().trim().min(1),
  author: Joi.string().required().trim().min(1),
  ISBN: Joi.number().required().min(13),
  quantity: Joi.number().required().min(0),
  location: Joi.string().required().trim(),
});

export const getBookValidator = Joi.object().keys({
  title: Joi.string().optional().trim(),
  author: Joi.string().optional().trim(),
  ISBN: Joi.number().optional(),
});

export const bookIdValidator = Joi.object().keys({
  bookId: Joi.string().guid().required().label("Book Id"),
});

export const updateBookValidator = Joi.object().keys({
  title: Joi.string().optional().trim().min(1),
  author: Joi.string().optional().trim().min(1),
  ISBN: Joi.number().optional().min(13),
  quantity: Joi.number().optional().min(0),
  location: Joi.string().optional().trim().alphanum(),
});
