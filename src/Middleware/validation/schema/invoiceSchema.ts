import { body } from "express-validator";

const schema = [
  body("outletName").isString().notEmpty(),
  body("company_id").isString().notEmpty(),
  body("truck_id").isNumeric().notEmpty(),
  body("route_id").isNumeric().notEmpty(),
  body("outlet_id").isNumeric().notEmpty(),
  body("material_id").isNumeric().notEmpty(),
  body("quantity").isNumeric().notEmpty(),
];

export { schema as InvoiceSchema };
