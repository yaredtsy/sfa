import express from "express";
import status from "http-status-codes";

import { Region } from "entity/Region";
import { Route } from "entity/Route";
import { Truck } from "entity/Truck";
import { createConnection } from "typeorm";
import { RouteMarket } from "entity/RouteMarket";
import { Company } from "entity/Company";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM route_market WHERE id != 1");
  return con;
});

const CreateRouteMarket = async (req: any, res: express.Response) => {
  let {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    route_id,
    truck_id,
    fromDate,
    toDate,
  } = req.body;
  if (!(route_id && truck_id)) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }
  const date = new Date();
  fromDate = date;
  toDate = date;

  try {
    const repo = (await conn).getRepository(RouteMarket);
    const repo2 = (await conn).getRepository(User);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });

    const route = await (await conn)
      .getRepository(Route)
      .findOne({ where: { id: route_id } });

    const truck = await (await conn)
      .getRepository(Truck)
      .findOne({ where: { id: truck_id } });
    const newRM = repo.create({
      created_by: user,
      route_id: route,
      truck_id: truck,
      fromDate,
      toDate,
    });
    await newRM.save();

    return res.status(status.CREATED).json({ routeMarket: newRM });
  } catch (err) {
    console.log(err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
};

const GetAll = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(RouteMarket);
    const routeMarkets = await repo.find();
    if (routeMarkets.length == 0) {
      return res
        .status(status.NOT_FOUND)
        .json({ msg: "RouteMarket table is Empty" });
    }
    res.status(status.OK).json({ routeMarket: routeMarkets });
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
};

const GetOne = async (req: any, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(RouteMarket);
    const routeMarket = await repo.findOne({ where: { id } });

    if (!routeMarket) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    res.status(status.OK).json(routeMarket);
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

const UpdateRouteMarket = async (req: any, res: express.Response) => {
  const id = Number(req.params.id);

  const {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    route_id,
    truck_id,
    status_control,
  } = req.body;

  try {
    const repo = (await conn).getRepository(RouteMarket);

    const routeMarket = await repo.findOne({ where: { id } });
    if (!routeMarket) {
      return res.status(404).json({ routeMarket, msg: "not Found" });
    }
    if (
      !(
        route_id ||
        truck_id ||
        monday ||
        tuesday ||
        wednesday ||
        thursday ||
        saturday ||
        friday ||
        status_control
      )
    ) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }

    let truck = null;
    let route = null;

    if (truck_id) {
      truck = await (await conn)
        .getRepository(Truck)
        .findOne({ where: { id: truck_id } });

      if (!truck ) {
        return res.status(status.OK).json({ msg: "error with truck", });
      }
    }

    if (route_id) {
      route = await (await conn)
        .getRepository(Route)
        .findOne({ where: { id: route_id } });
      if (!route ) {
        return res.status(400).json({ msg: "error with route"});
      }
    }
    routeMarket.monday = monday || routeMarket.monday;
    routeMarket.tuesday = tuesday || routeMarket.tuesday;
    routeMarket.wednesday = wednesday || routeMarket.wednesday;
    routeMarket.thursday = thursday || routeMarket.thursday;
    routeMarket.friday = friday || routeMarket.friday;
    routeMarket.saturday = saturday || routeMarket.saturday;
    routeMarket.truck_id = truck || routeMarket.truck_id;
    routeMarket.route_id = route || routeMarket.route_id;
    routeMarket.status_control = status_control || routeMarket.status_control;

    await routeMarket.save();
    res.status(status.OK).json({ routeMarket: routeMarket });
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};


const Delete = async(req: express.Request, res: express.Response) =>{
    const id = Number(req.params.id);
    try {
      const repo = (await conn).getRepository(RouteMarket);
      const routeMarket = await repo.findOne({ where: { id } });

      if (!routeMarket) {
        return res.status(status.NOT_FOUND).json({ msg: "not Found" });
      }

      routeMarket.status_control = 0;
      await routeMarket.save();
      res.status(status.OK).json({ routeMarket,});

    } catch (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server error" });
    }
}

export {
    CreateRouteMarket,
    GetAll,
    GetOne,
    UpdateRouteMarket,
    Delete
}