import { Router } from "express";
import { createConnection } from "typeorm";
import { Nation } from "../entity/Nation";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM nation WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  const { nationCode, nationName } = req.body;
  if(!(nationCode && nationName)){
    return res.status(400).json("Please insert all fields");
  }
  if(nationCode){
    if(nationCode.length != 2){
      return res.status(400).json("nation code cant be longer than 2 characters");
    }
  }
  try {
    const repo = (await conn).getRepository(Nation);
    const repo2 = (await conn).getRepository(User);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const newNation = repo.create({ nationCode, nationName, created_by: user });
    await newNation.save();

    return res.status(201).json({ msg: "new nation created", nation: newNation });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server error" });
  }
});

// GET ALL
router.get("/", isAuthenticated,async (req, res) => {
  try {
    const repo = (await conn).getRepository(Nation);
    console.log(req)
    const allNation = await repo.find();
    if (allNation.length == 0) {
      return res.status(200).json({ msg: "Nation table is Empty", allNation });
    }
    res.status(200).json({ msg: "success", nation: allNation });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Nation);
    const nation = await repo.find({ where: { id: id } });
    if (!nation || Object.keys(nation).length === 0) {
      return res.status(404).json({ nation, msg: "not Found" });
    }
    res.status(200).json(nation);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { nationCode, nationName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Nation);
    let nation = await repo.find({ where: { id: id } });
    if (!nation || Object.keys(nation).length === 0) {
      return res.status(404).json({ nation, msg: "not Found" });
    }
    if(!(nationCode || nationName || status_control)){
      return res.status(400).json({ msg: "BAD DATA", body: req.body });
    }
    if(nationCode){
      if (nationCode.length != 2 ) {
        return res.status(400).json({ msg: "BAD DATA", body: req.body });
      }
    }
    
    nation[0].nationCode = nationCode || nation[0].nationCode;
    nation[0].nationName = nationName || nation[0].nationName;
    nation[0].status_control = status_control || nation[0].status_control;
    await nation[0].save();
    res.status(200).json({ nation: nation[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Nation);
    let nation = await repo.find({ where: { id: id } });
    if (!nation || Object.keys(nation).length === 0) {
      return res.status(404).json({ nation, msg: "not Found" });
    }
    nation[0].status_control = 0;
    await nation[0].save();
    res.status(202).json({ nation, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
