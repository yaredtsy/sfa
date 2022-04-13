import { createConnection } from "typeorm";
import express from "express";
import status from "http-status-codes";

import { Company } from "entity/Company";
import { Nation } from "entity/Nation";
import { Region } from "entity/Region";
import { Territory } from "entity/Territory";
import { Truck } from "entity/Truck";
import { User } from "entity/User";
import isAuthenticated from "Middleware/isAuthenticated";

const conn = createConnection().then((con) => {
  // con.query("DELETE FROM user_detail WHERE id != 1");
  return con;
});

const CreateTruck = async (req: any, res: express.Response, next: any) => {
  const { territory_id, truckCode, truckName, plateNumber } = req.body;

  try {
    const repo = (await conn).getRepository(Truck);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Territory);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });
    const territory = await repo3.findOne({ where: { id: territory_id } });

    const newTruck = repo.create({
      created_by: user,
      truckCode,
      truckName,
      plateNumber,
      territory_id: territory,
    });
    await newTruck.save();

    return res.status(status.OK).json({ truck: newTruck });
  } catch (err) {
    return res.status(400).json({ msg: "phone or email already exist" });
  }
};

const GetAllTruck = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(Truck);
    const trucks = await repo.find();
    if (trucks.length == 0) {
      return res.status(status.NOT_FOUND).json({ msg: "not found" });
    }
    res.status(status.OK).json({ truck: trucks });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetUser = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Truck);
    const truck = await repo.findOne({ where: { id } });
    if (!truck) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    res.status(status.OK).json(truck);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const UpdateTruck = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const { territory_id, truckCode, truckName, plateNumber, status_control } =
    req.body;
  try {
    const repo = (await conn).getRepository(Truck);
    const repo2 = (await conn).getRepository(Territory);

    const truck = await repo.findOne({ where: { id } });

    const territory = await repo2.findOne({ where: { id: territory_id } });
    
    if (!territory) {
      return res.status(status.NOT_FOUND).json({ msg: "Territory not found" });
    }

    if (!truck) {
      return res.status(status.NOT_FOUND).json({ msg: "Truck not found" });
    }

    truck.territory_id = territory || truck?.territory_id;
    truck.truckCode = truckCode || truck?.truckCode;
    truck.truckName = truckName || truck?.truckName;
    truck.plateNumber = truckName || truck?.plateNumber;
    truck.status_control = status_control || truck?.status_control;

    await truck.save();

    res.status(status.OK).json({ truck: truck });
  } catch (err) {
    console.log(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteTruck = async (req: express.Request, res: express.Response)=>{
    const id = Number(req.params.id);
    try {
      const repo = (await conn).getRepository(Truck);
      const truck = await repo.findOne({ where: { id } });

      if (!truck) {
        return res.status(status.NOT_FOUND).json({ msg: "not Found" });
      }
      truck.status_control = 0;
      await truck.save();
      res.status(status.OK).json({ truck });
    } catch (err) {
      res.status(status.NOT_FOUND).json({ msg: err });
    }
}

export {DeleteTruck ,UpdateTruck, GetUser ,GetAllTruck , CreateTruck}