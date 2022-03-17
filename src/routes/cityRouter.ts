import { Router } from "express";
import { createConnection } from "typeorm";
import { City } from "../entity/CityDetail";
import { Nation } from "../entity/Nation";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";


const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM city_detail WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let { nation_id, city, subCity, specificArea } = req.body;
  if (!(nation_id && city && subCity && specificArea )) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }
  
  try {
    const repo = (await conn).getRepository(City);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Nation);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const nation = await repo3.findOne({ where: { id: nation_id } });
    const newCity = repo.create({
      created_by: user,
      city,
      subCity,
      specificArea,
      nation_id: nation,
    });
    await newCity.save();

    return res.status(201).json({ msg: "new city created", city: newCity });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(City);
    const cities = await repo.find();
    if (cities.length == 0) {
      return res.status(200).json({ msg: "Truck table is Empty", cities });
    }
    res.status(200).json({ msg: "success", city: cities });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(City);
    const city = await repo.find({ where: { id: id } });
    if (!city || Object.keys(city).length === 0) {
      return res.status(404).json({ city, msg: "not Found" });
    }
    res.status(200).json(city);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { nation_id, city, subCity, specificArea, status_control } = req.body;
  const cc = city;
  try {
    const repo = (await conn).getRepository(City);
    const repo2 = (await conn).getRepository(Nation);
    let city = await repo.find({ where: { id: id } });
    if (!city || Object.keys(city).length === 0) {
      return res.status(404).json({ city, msg: "not Found" });
    }
    if (!(nation_id || cc || specificArea || status_control || subCity )) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }   

    const nation = await repo2.findOne({ where: { id: nation_id } });
    if (!nation || Object.keys(nation).length == 0) {
      return res.status(400).json({ msg: "error with nation", nation });
    }
    city[0].nation_id = nation || city[0].nation_id;
    city[0].city = cc || city[0].city;
    city[0].subCity = subCity || city[0].subCity;
    city[0].specificArea = specificArea || city[0].specificArea;
    city[0].status_control = status_control || city[0].status_control;
    
    await city[0].save();
    res.status(200).json({ city: city[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(City);
    let city = await repo.find({ where: { id: id } });
    if (!city || Object.keys(city).length === 0) {
      return res.status(404).json({ city, msg: "not Found" });
    }
    city[0].status_control = 0;
    await city[0].save();
    res.status(202).json({ city, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
