import { body } from "express-validator";

const schmea = [
  body("nationCode").isNumeric().isLength({ min: 2, max: 2 }).notEmpty(),
  body("nationName").isString().notEmpty(),
];

export { schmea as NationalSchema };
