import express from "express";
import status from "http-status-codes";

import { createConnection } from "typeorm";
import { City } from "entity/CityDetail";
import { Nation } from "entity/Nation";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM city_detail WHERE id != 1");
  return con;
});

const CreateCity = async (req: any, res: express.Response) => {
  const { nation_id, city, subCity, specificArea } = req.body;

  try {
    const repo = (await conn).getRepository(City);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Nation);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });
    const nation = await repo3.findOne({ where: { id: nation_id } });

    const newCity = repo.create({
      created_by: user,
      city,
      subCity,
      specificArea,
      nation_id: nation,
    });
    await newCity.save();

    return res.status(status.CREATED).json({ newCity });
  } catch (err) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetAllCity = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(City);
    const cities = await repo.find();
    if (cities.length == 0) {
      return res.status(status.NOT_FOUND).json({ msg: "Truck table is Empty" });
    }
    res.status(status.OK).json({ city: cities });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetOneCity = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(City);
    const city = await repo.findOne({ where: { id } });

    if (!city) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    res.status(status.OK).json(city);
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const UpdateCity = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);

  const { nation_id, city, subCity, specificArea, status_control } = req.body;
  const cc = city;

  try {
    const repo = (await conn).getRepository(City);
    const repo2 = (await conn).getRepository(Nation);
    const city = await repo.findOne({ where: { id } });

    if (!city) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    const nation = await repo2.findOne({ where: { id: nation_id } });
    if (!nation) {
      return res.status(status.NOT_FOUND).json({ msg: "error with nation" });
    }

    city.nation_id = nation || city.nation_id;
    city.city = cc || city.city;
    city.subCity = subCity || city.subCity;
    city.specificArea = specificArea || city.specificArea;
    city.status_control = status_control || city.status_control;

    await city.save();
    res.status(200).json(city);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const DeleteCity = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(City);
    const city = await repo.findOne({ where: { id } });

    if (!city) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    city.status_control = 0;
    await city.save();
    res.status(202).json({ city });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

export { CreateCity, GetAllCity, GetOneCity, UpdateCity, DeleteCity };
