import express from "express";
import status from "http-status-codes";

import { createConnection } from "typeorm";
import { Company } from "entity/Company";
import { Region } from "entity/Region";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM region WHERE id != 1");
  return con;
});

const CreateRegion = async (req: any, res: express.Response) => {
  const { company_id, regionCode, regionName } = req.body;

  if (!(company_id && regionCode && regionName)) {
    return res.status(status.OK).json({
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

    return res.status(status.CREATED).json({ region: newRegion });
  } catch (err) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetAll = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(Region);
    const regions = await repo.find();

    if (regions.length == 0) {
      return res
        .status(status.NOT_IMPLEMENTED)
        .json({ msg: "Company table is Empty" });
    }

    res.status(status.OK).json({ region: regions });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
};

const GetOneRegion = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Region);
    const region = await repo.findOne({ where: { id } });
    if (!region) {
      return res.status(status.NOT_FOUND).json({ region });
    }
    res.status(status.OK).json(region);
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

const UpdateRegion = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const { company_id, regionCode, regionName, status_control } = req.body;

  try {
    const repo = (await conn).getRepository(Region);
    const repo2 = (await conn).getRepository(Company);
    const region = await repo.findOne({ where: { id } });

    if (!region) {
      return res.status(status.OK).json({ msg: "not Found" });
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
    if (!company) {
      return res.status(400).json({ msg: "error with nation" });
    }
    region.company_id = company || region.company_id;
    region.regionCode = regionCode || region.regionCode;
    region.regionName = regionName || region.regionName;
    region.status_control = status_control || region.status_control;

    await region.save();
    res.status(status.OK).json({ region });
  } catch (err) {
    console.log(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteRegion = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Region);
    const region = await repo.findOne({ where: { id } });

    if (!region) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    region.status_control = 0;
    await region.save();

    res.status(status.OK).json({ region });
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

export { CreateRegion, GetAll, GetOneRegion, UpdateRegion, DeleteRegion };
