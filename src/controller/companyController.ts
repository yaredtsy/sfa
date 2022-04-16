import express from "express";
import status from "http-status-codes";

import { createConnection } from "typeorm";
import { Company } from "entity/Company";
import { Nation } from "entity/Nation";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM company WHERE id != 1");
  return con;
});

const CreateCompany = async (req: any, res: express.Response) => {
  const { nation_id, companyCode, companyName, city, address, numberOfAgents } =
    req.body;

  if (companyCode.length != 2) {
    return res
      .status(400)
      .json({ msg: "Company code cant be longer than 2 characters" });
  }
  try {
    const repo = (await conn).getRepository(Company);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Nation);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });
    const nation = await repo3.findOne({ where: { id: nation_id } });

    if (!user) {
      return res.status(status.NOT_FOUND).json({ msg: "user not found" });
    }

    if (!nation) {
      return res.status(status.NOT_FOUND).json({ msg: "nation not found" });
    }

    const newCompany = repo.create({
      companyCode,
      companyName,
      address,
      numberOfAgents,
      company_nation_id: nation,
      created_by: user,
    });

    await newCompany.save();

    return res.status(status.CREATED).json({ company: newCompany });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

const GetAllCompany = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(Company);
    const comapnies = await repo.find();
    if (comapnies.length == 0) {
      return res
        .status(status.NOT_FOUND)
        .json({ msg: "Company table is Empty" });
    }
    res.status(200).json({ comapnies });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const GetOneCompany = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Company);
    const company = await repo.findOne({ where: { id } });

    if (!company) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    res.status(status.OK).json(company);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const UpdateCompany = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const {
    nation_id,
    companyCode,
    companyName,
    city,
    address,
    numberOfAgents,
    status_control,
  } = req.body;
  try {
    const repo = (await conn).getRepository(Company);
    const repo2 = (await conn).getRepository(Nation);
    const company = await repo.findOne({ where: { id } });

    if (!company) {
      return res.status(status.NOT_FOUND).json({ company, msg: "not Found" });
    }

    if (companyCode) {
      if (companyCode.length != 2) {
        return res.status(400).json({ msg: "BAD DATA" });
      }
    }

    const nation = await repo2.findOne({ where: { id: nation_id } });
    if (!nation) {
      res.status(status.NOT_FOUND).json({ msg: "error with nation", nation });
    }

    company.company_nation_id = nation || company.company_nation_id;
    company.companyCode = companyCode || company.companyCode;
    company.companyName = companyName || company.companyName;
    company.status_control = status_control || company.status_control;

    company.address = address || company.address;
    company.numberOfAgents = numberOfAgents || company.numberOfAgents;
    await company.save();

    res.status(status.OK).json(company);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteCompany = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Company);
    const company = await repo.findOne({ where: { id } });

    if (!company) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    company.status_control = 0;
    await company.save();

    res.status(status.OK).json({ company });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

export {
  CreateCompany,
  GetAllCompany,
  GetOneCompany,
  UpdateCompany,
  DeleteCompany,
};
