import { Router } from "express";
import { createConnection } from "typeorm";
import { Company } from "../entity/Company";
import { Region } from "../entity/Region";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM region WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let { company_id, regionCode, regionName } = req.body;
  if (!(company_id && regionCode && regionName)) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }
  if (regionCode) {
    if (regionCode.length > 5) {
      return res
        .status(400)
        .json({ msg: "region code cant be longer than 5 characters" });
    }
  }

  try {
    const repo = (await conn).getRepository(Region);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Company);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const company = await repo3.findOne({ where: { id: company_id } });
    const newRegion = repo.create({
      created_by: user,
      regionCode,
      regionName,
      company_id: company,
    });
    await newRegion.save();

    return res.status(201).json({ msg: "new user created", region: newRegion });
  } catch (err) {
    return res.status(400).json({ msg: "phone or email already exist" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Region);
    const regions = await repo.find();
    if (regions.length == 0) {
      return res.status(200).json({ msg: "Company table is Empty", regions });
    }
    res.status(200).json({ msg: "success", region: regions });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Region);
    const region = await repo.find({ where: { id: id } });
    if (!region || Object.keys(region).length === 0) {
      return res.status(404).json({ region, msg: "not Found" });
    }
    res.status(200).json(region);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { company_id, regionCode, regionName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Region);
    const repo2 = (await conn).getRepository(Company);
    let region = await repo.find({ where: { id: id } });
    if (!region || Object.keys(region).length === 0) {
      return res.status(404).json({ region, msg: "not Found" });
    }
    if (!(company_id || regionCode || status_control || regionName)) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    if (regionCode) {
      if (regionCode.length > 5) {
        return res.status(400).json({ msg: "BAD DATA", body: req.body });
      }
    }

    const company = await repo2.findOne({ where: { id: company_id } });
    if (!company || Object.keys(company).length == 0) {
      return res.status(400).json({ msg: "error with nation", company });
    }
    region[0].company_id = company || region[0].company_id;
    region[0].regionCode = regionCode || region[0].regionCode;
    region[0].regionName = regionName || region[0].regionName;
    region[0].status_control = status_control || region[0].status_control;
    
    await region[0].save();
    res.status(200).json({ region, msg: "Successfully updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Region);
    let region = await repo.find({ where: { id: id } });
    if (!region || Object.keys(region).length === 0) {
      return res.status(404).json({ region, msg: "not Found" });
    }
    region[0].status_control = 0;
    await region[0].save();
    res.status(202).json({ region, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
