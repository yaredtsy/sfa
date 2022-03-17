import { Router } from "express";
import { RouteMarket } from "../entity/RouteMarket";
import { createConnection } from "typeorm";
import { Company } from "../entity/Company";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";
import { Region } from "../entity/Region";
import { Route } from "../entity/Route";
import { Truck } from "../entity/Truck";


const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM route_market WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let {
    monday, tuesday, wednesday, thursday, friday, saturday, route_id, truck_id, fromDate, toDate
  } = req.body;
  if (
    !(route_id && truck_id)
  ) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }
  let date = new Date();
  fromDate = date;
  toDate = date;
  

  try {
    const repo = (await conn).getRepository(RouteMarket);
    const repo2 = (await conn).getRepository(User);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const route = await (await conn).getRepository(Route).findOne({where: {id: route_id}})
    const truck = await (await conn).getRepository(Truck).findOne({where: {id: truck_id}})
    const newRM = repo.create({
      created_by: user,
      route_id: route,
      truck_id: truck,
      fromDate, toDate

    });
    await newRM.save();

    return res
      .status(201)
      .json({ msg: "new routeMarket created", routeMarket: newRM });
  } catch (err) {
      console.log(err)
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(RouteMarket);
    const routeMarkets = await repo.find();
    if (routeMarkets.length == 0) {
      return res
        .status(200)
        .json({ msg: "RouteMarket table is Empty", routeMarkets });
    }
    res.status(200).json({ msg: "success", routeMarket: routeMarkets });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(RouteMarket);
    const routeMarket = await repo.find({ where: { id: id } });
    if (!routeMarket || Object.keys(routeMarket).length === 0) {
      return res.status(404).json({ routeMarket, msg: "not Found" });
    }
    res.status(200).json(routeMarket);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const {
    monday, tuesday, wednesday, thursday, friday, saturday, route_id, truck_id,
    status_control,
  } = req.body;
  try {
    const repo = (await conn).getRepository(RouteMarket);
    
    let routeMarket = await repo.find({ where: { id: id } });
    if (!routeMarket || Object.keys(routeMarket).length === 0) {
      return res.status(404).json({ routeMarket, msg: "not Found" });
    }
    if (
      !(
        route_id || truck_id|| monday || tuesday || wednesday || thursday || saturday || friday ||
        status_control
      )
    ) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    let truck = null, route = null;
    if(truck_id){
        truck = await (await conn).getRepository(Truck).findOne({where: {id: truck_id}});
        if (!truck || Object.keys(truck).length == 0) {
            return res.status(400).json({ msg: "error with truck", truck });
        }
    }

    if(route_id){
        route = await (await conn).getRepository(Route).findOne({where: {id: route_id}});
        if (!route || Object.keys(route).length == 0) {
            return res.status(400).json({ msg: "error with route", route });
        }
    }
    routeMarket[0].monday = monday || routeMarket[0].monday;
    routeMarket[0].tuesday = tuesday || routeMarket[0].tuesday;
    routeMarket[0].wednesday = wednesday || routeMarket[0].wednesday;
    routeMarket[0].thursday = thursday || routeMarket[0].thursday;
    routeMarket[0].friday = friday || routeMarket[0].friday;
    routeMarket[0].saturday = saturday || routeMarket[0].saturday;
    routeMarket[0].truck_id = truck || routeMarket[0].truck_id;
    routeMarket[0].route_id = route || routeMarket[0].route_id;
    routeMarket[0].status_control = status_control || routeMarket[0].status_control;

    await routeMarket[0].save();
    res
      .status(200)
      .json({ routeMarket: routeMarket[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(RouteMarket);
    let routeMarket = await repo.find({ where: { id: id } });
    if (!routeMarket || Object.keys(routeMarket).length === 0) {
      return res.status(404).json({ routeMarket, msg: "not Found" });
    }
    routeMarket[0].status_control = 0;
    await routeMarket[0].save();
    res.status(202).json({ routeMarket, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
