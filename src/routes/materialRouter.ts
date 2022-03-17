import { Router } from "express";
import { createConnection } from "typeorm";
import { City } from "../entity/CityDetail";
import { Company } from "../entity/Company";
import { Material } from "../entity/Material";
import { Nation } from "../entity/Nation";
import { Outlet } from "../entity/Outlet";
import { Region } from "../entity/Region";
import { Route } from "../entity/Route";
import { Territory } from "../entity/Territory";
import { Truck } from "../entity/Truck";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM material WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let {
    comapny_id,
    brandType,
    brandName,
    unitPrice,
    description,
    sku
  } = req.body;
  if (
    !(
      comapny_id &&
      brandType &&
      brandName &&
      unitPrice &&
      description &&
      sku
    )
  ) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }

  try {
    const repo = (await conn).getRepository(Material);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Company);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const company = await repo3.findOne({ where: { id: comapny_id } });
    const newMaterial = repo.create({
      created_by: user,
      brandName,
      brandType,
      unitPrice,
      description,
      sku,
      company_id: company
    });
    await newMaterial.save();

    return res.status(201).json({ msg: "new material created", material: newMaterial });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});


// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Material);
    const materials = await repo.find();
    if (materials.length == 0) {
      return res.status(200).json({ msg: "Material table is Empty", materials });
    }
    res.status(200).json({ msg: "success", material: materials });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Material);
    const material = await repo.find({ where: { id: id } });
    if (!material || Object.keys(material).length === 0) {
      return res.status(404).json({ material, msg: "not Found" });
    }
    res.status(200).json(material);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const {
    company_id,
    brandType,
    brandName,
    unitPrice,
    description,
    sku,
    status_control,
  } = req.body;
  try {
    const repo = (await conn).getRepository(Material);
    const repo2 = (await conn).getRepository(Company);
    let material = await repo.find({ where: { id: id } });
    if (!material || Object.keys(material).length === 0) {
      return res.status(404).json({ material, msg: "not Found" });
    }
    if (
      !(
        company_id ||
        brandType ||
        brandType ||
        unitPrice ||
        description ||
        sku ||
        status_control
      )
    ) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    let company = null;
    
    if (company_id) {
      company = await repo2.findOne({ where: { id: company_id } });

      if (!company || Object.keys(company).length == 0) {
        return res.status(400).json({ msg: "error with company", company });
      }
    }

    material[0].company_id = company || material[0].company_id;
    material[0].brandType = brandType || material[0].brandType;
    material[0].brandName = brandName || material[0].brandName;
    material[0].unitPrice = unitPrice || material[0].unitPrice;
    material[0].description = description || material[0].description;
    material[0].sku = sku || material[0].sku;
    material[0].status_control = status_control || material[0].status_control;

    await material[0].save();
    res.status(200).json({ material: material[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Material);
    let material = await repo.find({ where: { id: id } });
    if (!material || Object.keys(material).length === 0) {
      return res.status(404).json({ material, msg: "not Found" });
    }
    material[0].status_control = 0;
    await material[0].save();
    res.status(202).json({ material, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
