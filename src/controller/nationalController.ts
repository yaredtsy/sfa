import { createConnection } from "typeorm";
import express from "express";
import status from "http-status-codes";

import { Nation } from "entity/Nation";
import { User } from "entity/User";

const conn = createConnection().then((con) => {
  // con.query("DELETE FROM nation WHERE id != 1");
  return con;
});

const createNation = async (req: any, res: express.Response) => {
  const { nationCode, nationName } = req.body;

  try {
    const repo = (await conn).getRepository(Nation);
    const repo2 = (await conn).getRepository(User);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const newNation = repo.create({ nationCode, nationName, created_by: user });
    await newNation.save();

    return res.status(status.CREATED).json(newNation);
  } catch (err) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetAllNation = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(Nation);
    const nation = await repo.find();
    if (nation.length == 0) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    res.status(status.OK).json(nation);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetOneNation = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Nation);
    const nation = await repo.findOne({ where: { id } });
    if (!nation) {
      return res.status(404).json({ msg: "not Found" });
    }
    res.status(status.OK).json(nation);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const UpdateNational = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const { nationCode, nationName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Nation);
    const nation = await repo.findOne({ where: { id } });
    if (!nation) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    if (nationCode) {
      if (nationCode.length != 2) {
        return res.status(400).json({ msg: "BAD DATA", body: req.body });
      }
    }

    nation.nationCode = nationCode || nation.nationCode;
    nation.nationName = nationName || nation.nationName;
    nation.status_control = status_control || nation.status_control;
    await nation.save();

    res.status(status.OK).json({ nation });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteNation = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Nation);
    const nation = await repo.findOne({ where: { id } });
    if (!nation) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    nation.status_control = 0;
    await nation.save();
    res.status(status.OK).json({ nation });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

export {
  createNation,
  GetAllNation,
  GetOneNation,
  UpdateNational,
  DeleteNation,
};
