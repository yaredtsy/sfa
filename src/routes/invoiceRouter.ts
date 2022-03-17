import { Router } from "express";
import { Invoice } from "../entity/Invoice";
import { createConnection, QueryRunner } from "typeorm";
import { Company } from "../entity/Company";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";
import { Region } from "../entity/Region";
import { Truck } from "../entity/Truck";
import { Material } from "../entity/Material";
import { Route } from "../entity/Route";
import { Outlet } from "../entity/Outlet";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM invoice WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let {
    outletName, company_id, truck_id, route_id, outlet_id, material_id, quantity
  } = req.body;
  if (
    !(outletName && company_id && truck_id && route_id && material_id && quantity )
  ) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }

  try {
    const repo = (await conn).getRepository(Invoice);
    const repo2 = (await conn).getRepository(User);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });

    const company = await (await conn).getRepository(Company).findOne({where: {id: company_id}})
    const truck = await (await conn).getRepository(Truck).findOne({where: {id: truck_id}})
    const route = await (await conn).getRepository(Route).findOne({where: {id: route_id}})
    const material = await (await conn).getRepository(Material).findOne({where: {id: material_id}})
    const outlet = (outlet_id ? await(await conn).getRepository(Outlet).findOne({where: {id: outlet_id}}) : null)
    const totalPrice = Number(quantity) * Number(material.unitPrice);
    const newInvoice = repo.create({
      created_by: user,
      outletName,
      company_id: company,
      truck_id: truck,
      route_id: route,
      material_id: material,
      outlet_id: outlet,
      totalPrice,
      quantity
    });
    await newInvoice.save();

    return res
      .status(201)
      .json({ msg: "new invoice created", invoice: newInvoice });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Invoice);
    const query = (await conn).createQueryRunner();
    const invoices = await repo.find();
    if (invoices.length == 0) {
      return res
        .status(200)
        .json({ msg: "Invoice table is Empty", invoices });
    }
    res.status(200).json({ msg: "success", invoice: invoices });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET by page number
router.get("/pages/:pageNumber", isAuthenticated, async (req, res) => {
  const pageNumber = Number(req.params.pageNumber);
  let pageSize = 20;
  try {
    const raw = await (await conn).manager.query("SELECT * FROM invoice ")
    let offset = (pageNumber - 1) * pageSize;
    let sql = `
      SELECT * FROM invoice 
      ORDER BY id
      OFFSET ${offset} ROWS 
      FETCH NEXT ${pageSize} ROWS ONLY
    `
    const invoices = await (await conn).manager.query(sql);
    res.status(200).json({ msg: "success", invoice: invoices });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Invoice);
    const invoice = await repo.find({ where: { id: id } });
    if (!invoice || Object.keys(invoice).length === 0) {
      return res.status(404).json({ invoice, msg: "not Found" });
    }
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const {
    quantity,
    status_control,
  } = req.body;
  try {
    const repo = (await conn).getRepository(Invoice);
    
    let invoice = await repo.find({ where: { id: id } });
    if (!invoice || Object.keys(invoice).length === 0) {
      return res.status(404).json({ invoice, msg: "not Found" });
    }
    if (
      !(
        quantity ||
        status_control
      )
    ) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    
    invoice[0].quantity = quantity || invoice[0].quantity;
    invoice[0].status_control = status_control || invoice[0].status_control;

    await invoice[0].save();
    res
      .status(200)
      .json({ invoice: invoice[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Invoice);
    let invoice = await repo.find({ where: { id: id } });
    if (!invoice || Object.keys(invoice).length === 0) {
      return res.status(404).json({ invoice, msg: "not Found" });
    }
    invoice[0].status_control = 0;
    await invoice[0].save();
    res.status(202).json({ invoice, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
