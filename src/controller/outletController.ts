import express from "express";
import status from "http-status-codes";

import { createConnection } from "typeorm";
import { Channel } from "entity/Channel";
import { City } from "entity/CityDetail";
import { Company } from "entity/Company";
import { Outlet } from "entity/Outlet";
import { Route } from "entity/Route";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM outlet WHERE id != 1");
  return con;
});

const CreateOutlet = async (req: any, res: express.Response) => {
  const {
    comapny_id,
    city_id,
    outletName,
    ownerName,
    phoneNumber,
    vatNumber,
    geoLat,
    geoLong,
    channel_id,
    route_id,
  } = req.body;

  try {
    const repo = (await conn).getRepository(Outlet);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Company);
    const repo4 = (await conn).getRepository(City);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });
    const company = await repo3.findOne({ where: { id: comapny_id } });
    const city = await repo4.findOne({ where: { id: city_id } });

    const route = await (await conn)
      .getRepository(Route)
      .findOne({ where: { id: route_id } });
    const channel = await (await conn)
      .getRepository(Channel)
      .findOne({ where: { id: channel_id } });

    const newOutlet = repo.create({
      created_by: user,
      outletName,
      ownerName,
      phoneNumber,
      vatNumber,
      geoLat,
      geoLong,
      company_id: company,
      city_id: city,
      channel_id: channel,
      route_id: route,
    });

    await newOutlet.save();

    return res.status(status.CREATED).json(newOutlet);
  } catch (err) {
    return res.status(status.NOT_FOUND).json({ msg: err });
  }
};

const GetAllController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const repo = (await conn).getRepository(Outlet);
    const outlets = await repo.find();

    if (outlets.length == 0) {
      return res.status(status.NOT_FOUND).json({ msg: "Truck table is Empty" });
    }
    res.status(status.OK).json(outlets);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetByPageNumber = async (req: express.Request, res: express.Response) => {
  const pageNumber = Number(req.params.pageNumber);
  const pageSize = 20;
  try {
    const offset = (pageNumber - 1) * pageSize;
    const sql = `
        SELECT * FROM outlet 
        ORDER BY id
        OFFSET ${offset} ROWS 
        FETCH NEXT ${pageSize} ROWS ONLY
      `;

    const outlets = await (await conn).manager.query(sql);
    res.status(200).json({ msg: "success", outlets });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
};

const GetOneOutlet = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Outlet);
    const outlet = await repo.findOne({ where: { id } });
    if (!outlet) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    res.status(status.OK).json(outlet);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const UpdateOutlet = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const {
    company_id,
    city_id,
    outletName,
    ownerName,
    phoneNumber,
    vatNumber,
    geoLat,
    geoLong,
    status_control,
  } = req.body;
  try {
    const repo = (await conn).getRepository(Outlet);
    const repo2 = (await conn).getRepository(Company);
    const repo3 = (await conn).getRepository(City);
    const outlet = await repo.findOne({ where: { id } });

    if (!outlet) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    let city = null;
    let company = null;

    city = await repo3.findOne({ where: { id: city_id } });
    if (!city) {
      return res.status(status.NOT_FOUND).json({ msg: "error with city" });
    }

    company = await repo2.findOne({ where: { id: company_id } });

    if (!company) {
      return res.status(status.NOT_FOUND).json({ msg: "error with company" });
    }

    outlet.city_id = city || outlet.city_id;
    outlet.company_id = company || outlet.company_id;
    outlet.outletName = outletName || outlet.outletName;
    outlet.ownerName = ownerName || outlet.ownerName;
    outlet.phoneNumber = phoneNumber || outlet.phoneNumber;
    outlet.vatNumber = vatNumber || outlet.vatNumber;
    outlet.geoLat = geoLat || outlet.geoLat;
    outlet.geoLong = geoLong || outlet.geoLong;
    outlet.status_control = status_control || outlet.status_control;

    await outlet.save();
    res.status(status.OK).json(outlet);
  } catch (err) {
    console.log(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteOutlet = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Outlet);
    const outlet = await repo.findOne({ where: { id } });
    if (!outlet) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    outlet.status_control = 0;
    await outlet.save();
    res.status(status.OK).json(outlet);
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

export {
  CreateOutlet,
  GetAllController,
  GetByPageNumber,
  GetOneOutlet,
  UpdateOutlet,
  DeleteOutlet,
};
