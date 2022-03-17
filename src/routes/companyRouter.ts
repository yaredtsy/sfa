import { Router } from "express";
import { createConnection } from "typeorm";
import { Company } from "../entity/Company";
import { Nation } from "../entity/Nation";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM company WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let { nation_id, companyCode, companyName,city, address, numberOfAgents } = req.body;
  if(!(nation_id && companyName && companyCode && city && address && numberOfAgents)){
    return res.status(400).json({msg: "Please insert Data properly and make sure all fields are filled"});
  }
  if (companyCode.length != 2) {
    return res.status(400).json({msg: "Company code cant be longer than 2 characters"})
  }
  try {
    const repo = (await conn).getRepository(Company);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Nation)
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const nation = await repo3.findOne({ where: {id: nation_id}})
    const newCompany = repo.create({ companyCode, companyName, city, address, numberOfAgents, company_nation_id: nation, created_by: user });
    await newCompany.save();

    return res.status(201).json({ msg: "new company created", company: newCompany });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Company);
    const comapnies = await repo.find();
    if (comapnies.length == 0) {
      return res.status(200).json({ msg: "Company table is Empty", company: comapnies });
    }
    res.status(200).json({ msg: "success", comapnies });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Company);
    const company = await repo.find({ where: { id: id } });
    if (!company || Object.keys(company).length === 0) {
      return res.status(404).json({ company, msg: "not Found" });
    }
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { nation_id, companyCode, companyName, city, address, numberOfAgents, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Company);
    const repo2 = (await conn).getRepository(Nation);
    let company = await repo.find({ where: { id: id } });
    if (!company || Object.keys(company).length === 0) {
      return res.status(404).json({ company, msg: "not Found" });
    }
    if(!(companyCode || nation_id || status_control || companyName || city || address || numberOfAgents)){
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    if(companyCode){
      if (companyCode.length != 2 ) {
        return res.status(400).json({ msg: "BAD DATA", body: req.body });
      }
    }
    
    const nation = await repo2.findOne({ where: {id: nation_id}})
    if(!nation || Object.keys(nation).length == 0){
      res.status(400).json({msg: "error with nation", nation})
    }
    company[0].company_nation_id = nation || company[0].company_nation_id 
    company[0].companyCode = companyCode || company[0].companyCode;
    company[0].companyName = companyName || company[0].companyName;
    company[0].status_control = status_control || company[0].status_control;
    company[0].city = city || company[0].city;
    company[0].address = address || company[0].address;
    company[0].numberOfAgents = numberOfAgents || company[0].numberOfAgents;
    await company[0].save();
    res.status(200).json({ company: company[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Company);
    let company = await repo.find({ where: { id: id } });
    if (!company || Object.keys(company).length === 0) {
      return res.status(404).json({ company, msg: "not Found" });
    }
    company[0].status_control = 0;
    await company[0].save();
    res.status(202).json({ company, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
