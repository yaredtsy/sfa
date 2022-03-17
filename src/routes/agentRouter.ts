import { Router } from "express";
import { Agent } from "../entity/Agent";
import { createConnection } from "typeorm";
import { Company } from "../entity/Company";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";
import { Region } from "../entity/Region";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM agent WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let {
    agentName,
    agentCode,
    address,
    company_id,
    email,
    phoneNumber,
    region_id
  } = req.body;
  if (
    !(agentName && agentCode && address && company_id && email && phoneNumber && region_id)
  ) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }

  try {
    const repo = (await conn).getRepository(Agent);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Company);
    const region = await (await conn).getRepository(Region).findOne({where: {id: region_id}})
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const company = await repo3.findOne({ where: { id: company_id } });
    const newAgent = repo.create({
      created_by: user,
      agentName,
      address,
      email,
      phoneNumber,
      agentCode,
      company_id: company,
      region_id: region
    });
    await newAgent.save();

    return res
      .status(201)
      .json({ msg: "new agent created", agent: newAgent });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Agent);
    const agents = await repo.find();
    if (agents.length == 0) {
      return res
        .status(200)
        .json({ msg: "Agent table is Empty", agents });
    }
    res.status(200).json({ msg: "success", agent: agents });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Agent);
    const agent = await repo.find({ where: { id: id } });
    if (!agent || Object.keys(agent).length === 0) {
      return res.status(404).json({ agent, msg: "not Found" });
    }
    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const {
    company_id,
    agentCode,
    agentName,
    phoneNumber,
    email,
    address,
    region_id,
    status_control,
  } = req.body;
  try {
    const repo = (await conn).getRepository(Agent);
    const repo2 = (await conn).getRepository(Company);
    
    let agent = await repo.find({ where: { id: id } });
    if (!agent || Object.keys(agent).length === 0) {
      return res.status(404).json({ agent, msg: "not Found" });
    }
    if (
      !(
        company_id ||
        agentCode ||
        agentName ||
        phoneNumber ||
        email ||
        address ||
        status_control
      )
    ) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    let company = null, region = null;

    if (company_id) {
      company = await repo2.findOne({ where: { id: company_id } });

      if (!company || Object.keys(company).length == 0) {
        return res.status(400).json({ msg: "error with company", company });
      }
    }
    if (region_id) {
        region = await (await conn).getRepository(Region).findOne({where: {id: region_id}})
  
        if (!region || Object.keys(region).length == 0) {
          return res.status(400).json({ msg: "error with region", company });
        }
      }

    agent[0].company_id = company || agent[0].company_id;
    agent[0].region_id = region || agent[0].region_id;
    agent[0].agentCode = agentCode || agent[0].agentCode;
    agent[0].agentName = agentName || agent[0].agentName;
    agent[0].phoneNumber = phoneNumber || agent[0].phoneNumber;
    agent[0].email = email || agent[0].email;
    agent[0].address = address || agent[0].address;
    agent[0].status_control = status_control || agent[0].status_control;

    await agent[0].save();
    res
      .status(200)
      .json({ agent: agent[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Agent);
    let agent = await repo.find({ where: { id: id } });
    if (!agent || Object.keys(agent).length === 0) {
      return res.status(404).json({ agent, msg: "not Found" });
    }
    agent[0].status_control = 0;
    await agent[0].save();
    res.status(202).json({ agent, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
