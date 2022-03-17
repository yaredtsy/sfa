import { Router } from "express";
import { createConnection } from "typeorm";
import { Company } from "../entity/Company";
import { Nation } from "../entity/Nation";
import { Region } from "../entity/Region";
import { Territory } from "../entity/Territory";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM territory WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let { region_id, territoryCode, territoryName } = req.body;
  if (!(region_id && territoryCode && territoryName)) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }
  if (territoryCode) {
    if (territoryCode.length > 8) {
      return res
        .status(400)
        .json({ msg: "Territory code cant be longer than 8 characters" });
    }
  }

  try {
    const repo = (await conn).getRepository(Territory);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Region);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const region = await repo3.findOne({ where: { id: region_id } });
    const newterritory = repo.create({
      created_by: user,
      territoryCode,
      territoryName,
      region_id: region,
    });
    await newterritory.save();

    return res.status(201).json({ msg: "new user created", territory: newterritory });
  } catch (err) {
    return res.status(400).json({ msg: "phone or email already exist" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Territory);
    const territories = await repo.find();
    if (territories.length == 0) {
      return res.status(200).json({ msg: "Territory table is Empty", territories });
    }
    res.status(200).json({ msg: "success", territory: territories });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Territory);
    const territory = await repo.find({ where: { id: id } });
    if (!territory || Object.keys(territory).length === 0) {
      return res.status(404).json({ territory, msg: "not Found" });
    }
    res.status(200).json(territory);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { region_id, territoryCode, territoryName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Territory);
    const repo2 = (await conn).getRepository(Region);
    let territory = await repo.find({ where: { id: id } });
    if (!territory || Object.keys(territory).length === 0) {
      return res.status(404).json({ territory, msg: "not Found" });
    }
    if (!(region_id || territoryCode || status_control || territoryName)) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    if (territoryCode) {
      if (territoryCode.length > 8) {
        return res.status(400).json({ msg: "BAD DATA", body: req.body });
      }
    }

    const region = await repo2.findOne({ where: { id: region_id } });
    if (!region || Object.keys(region).length == 0) {
      return res.status(400).json({ msg: "error with nation", region });
    }
    territory[0].region_id = region || territory[0].region_id;
    territory[0].territoryCode = territoryCode || territory[0].territoryCode;
    territory[0].territoryName = territoryName || territory[0].territoryName;
    territory[0].status_control = status_control || territory[0].status_control;
    
    await territory[0].save();
    res.status(200).json({ territory: territory[0], msg: "Successfully updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Territory);
    let territory = await repo.find({ where: { id: id } });
    if (!territory || Object.keys(territory).length === 0) {
      return res.status(404).json({ territory, msg: "not Found" });
    }
    territory[0].status_control = 0;
    await territory[0].save();
    res.status(202).json({ territory, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
