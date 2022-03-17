import { Router } from "express";
import { createConnection } from "typeorm";
import { Company } from "../entity/Company";
import { Nation } from "../entity/Nation";
import { Region } from "../entity/Region";
import { Territory } from "../entity/Territory";
import { Truck } from "../entity/Truck";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM truck WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let { territory_id, truckCode, truckName, plateNumber } = req.body;
  if (!(territory_id && truckCode && truckName && plateNumber)) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }
  if (truckCode) {
    if (truckCode.length > 9) {
      return res
        .status(400)
        .json({ msg: "Truckcode cant be longer than 8 characters" });
    }
  }
  if (plateNumber) {
    if (plateNumber.length > 7) {
      return res
        .status(400)
        .json({ msg: "Plate number cant be longer than 8 characters" });
    }
  }

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

    return res.status(201).json({ msg: "new user created", truck: newTruck });
  } catch (err) {
    return res.status(400).json({ msg: "phone or email already exist" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Truck);
    const trucks = await repo.find();
    if (trucks.length == 0) {
      return res.status(200).json({ msg: "Truck table is Empty", trucks });
    }
    res.status(200).json({ msg: "success", truck: trucks });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Truck);
    const truck = await repo.find({ where: { id: id } });
    if (!truck || Object.keys(truck).length === 0) {
      return res.status(404).json({ truck, msg: "not Found" });
    }
    res.status(200).json(truck);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { territory_id, truckCode, truckName, plateNumber, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Truck);
    const repo2 = (await conn).getRepository(Territory);
    let truck = await repo.find({ where: { id: id } });
    if (!truck || Object.keys(truck).length === 0) {
      return res.status(404).json({ truck, msg: "not Found" });
    }
    if (!(territory_id || truckCode || status_control || truckName || plateNumber)) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    if (truckCode) {
      if (truckCode.length > 9) {
        return res.status(400).json({ msg: "BAD DATA", body: req.body });
      }
    }

    if (plateNumber) {
        if (plateNumber.length > 7) {
          return res.status(400).json({ msg: "BAD DATA", body: req.body });
        }
      }

    const territory = await repo2.findOne({ where: { id: territory_id } });
    if (!territory || Object.keys(territory).length == 0) {
      return res.status(400).json({ msg: "error with nation", territory });
    }
    truck[0].territory_id = territory || truck[0].territory_id;
    truck[0].truckCode = truckCode || truck[0].truckCode;
    truck[0].truckName = truckName || truck[0].truckName;
    truck[0].plateNumber = truckName || truck[0].plateNumber;
    truck[0].status_control = status_control || truck[0].status_control;
    
    await truck[0].save();
    res.status(200).json({ truck: truck[0], msg: "Successfully updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Truck);
    let truck = await repo.find({ where: { id: id } });
    if (!truck || Object.keys(truck).length === 0) {
      return res.status(404).json({ truck, msg: "not Found" });
    }
    truck[0].status_control = 0;
    await truck[0].save();
    res.status(202).json({ truck, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
