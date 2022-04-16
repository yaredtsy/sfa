import { createConnection } from "typeorm";
import express from "express";
import status from "http-status-codes";

import { Route } from "entity/Route";
import { Truck } from "entity/Truck";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  con.query("DELETE FROM route WHERE id != 1");
  return con;
});

const Create = async (req: any, res: express.Response, next: any) => {
  const { truck_id, routeCode, routeName } = req.body;

  try {
    const repo = (await conn).getRepository(Route);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Truck);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });
    const truck = await repo3.findOne({ where: { id: truck_id } });

    const newRoute = repo.create({
      created_by: user,
      routeCode,
      routeName,
      truck_id: truck,
    });

    await newRoute.save();

    return res.status(status.CREATED).json({ route: newRoute });
  } catch (err) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const AddPolygon = async (req: express.Request, res: express.Response) => {
  const { polygonBody } = req.body;
  const polygonArr = polygonBody.split(",");
  for (let i = 0; i < polygonArr.length; i++) {
    polygonArr[i] = Number(polygonArr[i]);
  }

  try {
    const repo = await (await conn).getRepository(Route);
    const user = await (await conn)
      .getRepository(User)
      .findOne({ where: { id: 1 } });

    const truck = await (await conn)
      .getRepository(Truck)
      .findOne({ where: { id: 1 } });

    const newRoute = repo.create({
      created_by: user,
      routeCode: "ET",
      routeName: "Test Route",
      truck_id: truck,
      polygon: polygonBody,
    });

    await newRoute.save();

    return res.status(status.CREATED).json({ route: newRoute });
  } catch (err) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ err });
  }
};

const GetAll = async (req: express.Request, res: express.Response) => {
  {
    try {
      const repo = (await conn).getRepository(Route);
      const routes = await repo.find();
      if (routes.length == 0) {
        return res.status(status.NOT_FOUND).json({ msg: "routes not founded" });
      }
      res.status(status.CREATED).json({ routes });
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
};

const GetOne = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Route);
    const route = await repo.find({ where: { id } });
    if (!route || Object.keys(route).length === 0) {
      return res.status(404).json({ route, msg: "not Found" });
    }

    let coordinates = route[0].polygon;
    coordinates = coordinates.replace(/\(/g, "");
    coordinates = coordinates.replace(/\)/g, "");
    const arr = coordinates.split(",");
    const path = [];
    for (let i = 0; i < arr.length; i += 2) {
      const temp = [];
      temp.push(Number(arr[i + 1]));
      temp.push(Number(arr[i]));
      path.push(temp);
    }

    res.status(200).json(path);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
};

const Update = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const { truck_id, routeCode, routeName, status_control } = req.body;

  try {
    const repo = (await conn).getRepository(Route);
    const repo2 = (await conn).getRepository(Truck);
    const route = await repo.findOne({ where: { id } });

    if (!route) {
      return res.status(404).json({ msg: "not Found" });
    }

    const truck = await repo2.findOne({ where: { id: truck_id } });

    if (!truck) {
      return res.status(400).json({ msg: "error with nation" });
    }
    route.truck_id = truck || route.truck_id;
    route.routeCode = routeCode || route.routeCode;
    route.routeName = routeName || route.routeName;
    route.status_control = status_control || route.status_control;

    await route.save();

    res.status(status.OK).json({ route });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const Delete = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);

  try {
    const repo = (await conn).getRepository(Route);
    const route = await repo.findOne({ where: { id } });

    if (!route) {
      return res.status(status.NOT_FOUND).json({ route, msg: "not Found" });
    }

    route.status_control = 0;
    await route.save();

    res.status(status.OK).json({ route, msg: "Successfully deleted" });
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

export { Create, AddPolygon, GetAll, GetOne, Update, Delete };
