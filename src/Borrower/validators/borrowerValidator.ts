import Joi from "joi";
export const addBorrowerValidator = Joi.object().keys({
  name: Joi.string().required().trim().min(1),
  email: Joi.string().required().trim().min(1).email(),
});

export const borrowerIdValidator = Joi.object().keys({
  borrowerId: Joi.string().guid().required().label("borrowerId Id"),
});

export const updateBorrowerValidator = Joi.object().keys({
  name: Joi.string().optional().trim().min(1),
  email: Joi.string().optional().trim().min(1).email(),
});

export const borrowBookValidator = Joi.object().keys({
  book_id: Joi.string().guid().required().label("bookId Id"),
  expected_check_out: Joi.date()
    .required()
    .custom((value, helper) => {
      if (value < Date.now())
        return helper.message({
          custom: " expected_check_out must be in future",
        });
      return true;
    }),
});

export const returnBookValidator = Joi.object().keys({
  trackId: Joi.number().required().label("track Id"),
  bookId: Joi.string().guid().required().label("book Id"),
});
