import { createConnection } from "typeorm";
import express from "express";

import status from "http-status-codes";
import { Company } from "../entity/Company";
import { Nation } from "../entity/Nation";
import { Region } from "../entity/Region";
import { Territory } from "../entity/Territory";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const conn = createConnection().then((con) => {
  // con.query("DELETE FROM territory WHERE id != 1");
  return con;
});

const CreateTerritory = async (req: any, res: express.Response, next: any) => {
  const { region_id, territoryCode, territoryName } = req.body;

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

    return res.status(status.OK).json({ territory: newterritory });
  } catch (err) {
    return res.status(400).json({ msg: err });
  }
};

const GetAllTerritories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const repo = (await conn).getRepository(Territory);
    const territories = await repo.find();
    if (territories.length == 0) {
      return res
        .status(status.NOT_FOUND)
        .json({ msg: "Territory table is Empty" });
    }
    res.status(status.OK).json({ territory: territories });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const GetOneTerritory = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Territory);
    const territory = await repo.findOne({ where: { id } });
    if (!territory) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    res.status(status.OK).json(territory);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const UpdateTerritory = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const { region_id, territoryCode, territoryName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Territory);
    const repo2 = (await conn).getRepository(Region);

    const territory = await repo.findOne({ where: { id } });

    if (!territory) {
      return res.status(404).json({ territory, msg: "not Found" });
    }

    const region = await repo2.findOne({ where: { id: region_id } });

    if (!region || Object.keys(region).length == 0) {
      return res.status(status.NOT_FOUND).json({ region });
    }

    territory.region_id = region || territory.region_id;
    territory.territoryCode = territoryCode || territory.territoryCode;
    territory.territoryName = territoryName || territory.territoryName;
    territory.status_control = status_control || territory.status_control;

    await territory.save();
    res.status(status.OK).json({ territory });
  } catch (err) {
    console.log(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteTerritory = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Territory);
    const territory = await repo.findOne({ where: { id } });
    if (!territory) {
      return res.status(status.NOT_FOUND).json({ territory, msg: "not Found" });
    }
    territory.status_control = 0;
    await territory.save();
    res.status(status.OK).json({ territory });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

export {
  CreateTerritory,
  GetAllTerritories,
  GetOneTerritory,
  UpdateTerritory,
  DeleteTerritory,
};
