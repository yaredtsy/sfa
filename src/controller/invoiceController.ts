import { createConnection, QueryRunner } from "typeorm";
import express from "express";
import status from "http-status-codes";

import { Region } from "entity/Region";
import { Truck } from "entity/Truck";
import { Material } from "entity/Material";
import { Route } from "entity/Route";
import { Outlet } from "entity/Outlet";

import { Invoice } from "entity/Invoice";
import { Company } from "entity/Company";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM invoice WHERE id != 1");
  return con;
});

const CreateInvoice = async (req: any, res: express.Response) => {
  const {
    outletName,
    company_id,
    truck_id,
    route_id,
    outlet_id,
    material_id,
    quantity,
  } = req.body;

  try {
    const repo = (await conn).getRepository(Invoice);
    const repo2 = (await conn).getRepository(User);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });

    const company = await (await conn)
      .getRepository(Company)
      .findOne({ where: { id: company_id } });
    const truck = await (await conn)
      .getRepository(Truck)
      .findOne({ where: { id: truck_id } });
    const route = await (await conn)
      .getRepository(Route)
      .findOne({ where: { id: route_id } });
    const material = await (await conn)
      .getRepository(Material)
      .findOne({ where: { id: material_id } });
    const outlet = outlet_id
      ? await (await conn)
          .getRepository(Outlet)
          .findOne({ where: { id: outlet_id } })
      : null;

    if (!material) {
      return res.status(status.NOT_FOUND).json({ msg: "material not found" });
    }

    if (!user) {
      return res.status(status.NOT_FOUND).json({ msg: "user not found" });
    }

    if (!outlet) {
      return res.status(status.NOT_FOUND).json({ msg: "outlet not found" });
    }

    const totalPrice = Number(quantity) * Number(material.unitPrice);

    const newInvoice = repo.create({
      created_by: user,
      outletName: outletName,
      company_id: company,
      truck_id: truck,
      route_id: route,
      material_id: material,
      outlet_id: outlet,
      totalPrice,
      quantity,
    });
    await newInvoice.save();

    return res
      .status(201)
      .json({ msg: "new invoice created", invoice: newInvoice });
  } catch (err) {
    console.log(err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
};

const GetAllInvoice = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(Invoice);
    const query = (await conn).createQueryRunner();
    const invoices = await repo.find();
    if (invoices.length == 0) {
      return res
        .status(status.NOT_FOUND)
        .json({ msg: "Invoice table is Empty" });
    }
    res.status(status.OK).json({ invoice: invoices });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetInvoiceByPageNumber = async (
  req: express.Request,
  res: express.Response
) => {
  const pageNumber = Number(req.params.pageNumber);
  const pageSize = 20;
  try {
    const raw = await (await conn).manager.query("SELECT * FROM invoice ");
    const offset = (pageNumber - 1) * pageSize;
    const sql = `
        SELECT * FROM invoice 
        ORDER BY id
        OFFSET ${offset} ROWS 
        FETCH NEXT ${pageSize} ROWS ONLY
      `;
    const invoices = await (await conn).manager.query(sql);
    res.status(status.OK).json({ msg: "success", invoice: invoices });
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong", err });
  }
};

const GetOneInvoice = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Invoice);
    const invoice = await repo.findOne({ where: { id } });

    if (!invoice) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    res.status(status.OK).json(invoice);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const UpdateInvoice = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const { quantity, status_control } = req.body;

  try {
    const repo = (await conn).getRepository(Invoice);

    const invoice = await repo.findOne({ where: { id } });
    if (!invoice) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    if (!(quantity || status_control)) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }

    invoice.quantity = quantity || invoice.quantity;
    invoice.status_control = status_control || invoice.status_control;

    await invoice.save();
    res.status(status.OK).json(invoice);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteInvoice = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Invoice);
    const invoice = await repo.findOne({ where: { id } });

    if (!invoice) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    invoice.status_control = 0;
    await invoice.save();
    res.status(status.OK).json({ invoice, msg: "Successfully deleted" });
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

export {
  CreateInvoice,
  GetAllInvoice,
  GetInvoiceByPageNumber,
  GetOneInvoice,
  UpdateInvoice,
  DeleteInvoice,
};
