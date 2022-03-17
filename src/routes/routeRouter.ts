import { Router } from "express";
import { createConnection } from "typeorm";
import { Route } from "../entity/Route";
import { Truck } from "../entity/Truck";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  con.query("DELETE FROM route WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let { truck_id, routeCode, routeName } = req.body;
  if (!(truck_id && routeCode && routeName )) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }
  if (routeCode) {
    if (routeCode.length > 12) {
      return res
        .status(400)
        .json({ msg: "route code cant be longer than 12 characters" });
    }
  }
  
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

    return res.status(201).json({ msg: "new user created", route: newRoute });
  } catch (err) {
    return res.status(400).json({ msg: "phone or email already exist" });
  }
});

// Add Polygon 
router.post("/add", async (req, res) =>{
  const { polygonBody } = req.body;
  let polygonArr = polygonBody.split(',')
  for(let i =0; i < polygonArr.length; i++){
    polygonArr[i] = Number(polygonArr[i])
  }
  console.log(polygonArr);
  console.log(typeof(polygonArr[1]));

  try {
    const repo = await (await conn).getRepository(Route);
    const user = await (await conn).getRepository(User).findOne({ where: { id: 1 } });
    const truck = await (await conn).getRepository(Truck).findOne({ where: { id: 1 } });
    const newRoute = repo.create({
      created_by: user,
      routeCode: "ET",
      routeName: "Test Route",
      truck_id: truck,
      polygon : polygonBody
    });
    await newRoute.save();

    return res.status(201).json({ msg: "new user created", route: newRoute });
  } catch(err){
    return res.status(500).json( {msg: "SERVER ERROR", err: err});
  }
})

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Route);
    const routes = await repo.find();
    if (routes.length == 0) {
      return res.status(200).json({ msg: "Truck table is Empty", route: routes });
    }
    res.status(200).json({ msg: "success", routes });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
// router.get("/:id", isAuthenticated, async (req, res) => {
//   const id = Number(req.params.id);
//   try {
//     const repo = (await conn).getRepository(Route);
//     const route = await repo.find({ where: { id: id } });
//     if (!route || Object.keys(route).length === 0) {
//       return res.status(404).json({ route, msg: "not Found" });
//     }
//     res.status(200).json(route);
//   } catch (err) {
//     res.status(500).json({ msg: "Internal Server error" });
//   }
// });

// GET ONE PATH
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Route);
    const route = await repo.find({ where: { id: id } });
    if (!route || Object.keys(route).length === 0) {
      return res.status(404).json({ route, msg: "not Found" });
    }

    let coordinates = route[0].polygon;
    coordinates = coordinates.replace(/\(/g, '');
    coordinates = coordinates.replace(/\)/g, '');
    let arr = coordinates.split(',');
    let path = [];
    for(let i=0; i< arr.length; i += 2){
      let temp = [];
      temp.push(Number(arr[i+1]))
      temp.push(Number(arr[i]))
      path.push(temp);
    }
    
    res.status(200).json(path);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { truck_id, routeCode, routeName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Route);
    const repo2 = (await conn).getRepository(Truck);
    let route = await repo.find({ where: { id: id } });
    if (!route || Object.keys(route).length === 0) {
      return res.status(404).json({ route, msg: "not Found" });
    }
    if (!(truck_id || routeCode || status_control || routeName )) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    if (routeCode) {
      if (routeCode.length > 12) {
        return res.status(400).json({ msg: "BAD DATA", body: req.body });
      }
    }

    const truck = await repo2.findOne({ where: { id: truck_id } });
    if (!truck || Object.keys(truck).length == 0) {
      return res.status(400).json({ msg: "error with nation", truck });
    }
    route[0].truck_id = truck || route[0].truck_id;
    route[0].routeCode = routeCode || route[0].routeCode;
    route[0].routeName = routeName || route[0].routeName;
    route[0].status_control = status_control || route[0].status_control;
    
    await route[0].save();
    res.status(200).json({ route: route[0], msg: "Successfully updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Route);
    let route = await repo.find({ where: { id: id } });
    if (!route || Object.keys(route).length === 0) {
      return res.status(404).json({ route, msg: "not Found" });
    }
    route[0].status_control = 0;
    await route[0].save();
    res.status(202).json({ route, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
