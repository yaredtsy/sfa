import { createConnection } from "typeorm";
import express from "express";
import status from "http-status-codes";


import { Company } from "entity/Company";
import { Material } from "entity/Material";

import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM material WHERE id != 1");
  return con;
});

const CreateMaterial = async (req: any, res: express.Response) => {
  const { comapny_id, brandType, brandName, unitPrice, description, sku } =
    req.body;

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
      company_id: company,
    });

    await newMaterial.save();

    return res.status(status.CREATED).json(newMaterial);
  } catch (err) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetAllMaterial = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(Material);
    const materials = await repo.find();
    if (materials.length == 0) {
      return res
        .status(status.NOT_FOUND)
        .json({ msg: "Material table is Empty" });
    }
    res.status(status.OK).json(materials);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetOneMaterial = async (req: any, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Material);
    const material = await repo.findOne({ where: { id } });
    if (!material) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    res.status(status.OK).json(material);
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

const UpdateMaterial = async (req: express.Request, res: express.Response) => {
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
    const material = await repo.findOne({ where: { id } });

    if (!material) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    let company = null;

    if (company_id) {
      company = await repo2.findOne({ where: { id: company_id } });

      if (!company) {
        return res
          .status(status.NOT_FOUND)
          .json({ msg: "error with company", company });
      }
    }

    material.company_id = company || material.company_id;
    material.brandType = brandType || material.brandType;
    material.brandName = brandName || material.brandName;
    material.unitPrice = unitPrice || material.unitPrice;
    material.description = description || material.description;
    material.sku = sku || material.sku;
    material.status_control = status_control || material.status_control;

    await material.save();
    res.status(status.OK).json({ material });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteMaterial = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Material);
    const material = await repo.findOne({ where: { id } });

    if (!material) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    material.status_control = 0;
    await material.save();

    res.status(status.OK).json({ msg: "Successfully deleted" });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

export { CreateMaterial, GetAllMaterial, GetOneMaterial, UpdateMaterial, DeleteMaterial };
