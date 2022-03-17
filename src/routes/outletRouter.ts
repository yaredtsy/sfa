import { Router } from "express";
import { createConnection } from "typeorm";
import { Channel } from "../entity/Channel";
import { City } from "../entity/CityDetail";
import { Company } from "../entity/Company";
import { Outlet } from "../entity/Outlet";
import { Route } from "../entity/Route";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM outlet WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  let {
    comapny_id,
    city_id,
    outletName,
    ownerName,
    phoneNumber,
    vatNumber,
    geoLat,
    geoLong,
    channel_id,
    route_id
  } = req.body;
  if (
    !(
      comapny_id &&
      city_id &&
      outletName &&
      ownerName &&
      phoneNumber &&
      vatNumber &&
      geoLat &&
      geoLong &&
      route_id && channel_id
    )
  ) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }

  try {
    const repo = (await conn).getRepository(Outlet);
    const repo2 = (await conn).getRepository(User);
    const repo3 = (await conn).getRepository(Company);
    const repo4 = (await conn).getRepository(City);
    const userid = Number(req.user.id);
    const user = await repo2.findOne({ where: { id: userid } });
    const company = await repo3.findOne({ where: { id: comapny_id } });
    const city = await repo4.findOne({ where: { id: city_id } });
    const route = await (await conn).getRepository(Route).findOne({where: {id: route_id}});
    const channel = await (await conn).getRepository(Channel).findOne({where: {id: channel_id}});

    const newOutlet = repo.create({
      created_by: user,
      outletName,
      ownerName,
      phoneNumber,
      vatNumber,
      geoLat,
      geoLong,
      company_id: company,
      city_id: city,
      channel_id: channel,
      route_id: route
    });
    await newOutlet.save();

    return res.status(201).json({ msg: "new user created", outlet: newOutlet });
  } catch (err) {
    return res.status(400).json({ msg: "phone or email already exist" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Outlet);
    const outlets = await repo.find();
    if (outlets.length == 0) {
      return res.status(200).json({ msg: "Truck table is Empty", outlets });
    }
    res.status(200).json({ msg: "success", outlet: outlets });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET by page number
router.get("/pages/:pageNumber", isAuthenticated, async (req, res) => {
  const pageNumber = Number(req.params.pageNumber);
  let pageSize = 20;
  try {
    let offset = (pageNumber - 1) * pageSize;
    let sql = `
      SELECT * FROM outlet 
      ORDER BY id
      OFFSET ${offset} ROWS 
      FETCH NEXT ${pageSize} ROWS ONLY
    `
    const outlets = await (await conn).manager.query(sql);
    res.status(200).json({ msg: "success", outlets: outlets });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Outlet);
    const outlet = await repo.find({ where: { id: id } });
    if (!outlet || Object.keys(outlet).length === 0) {
      return res.status(404).json({ outlet, msg: "not Found" });
    }
    res.status(200).json(outlet);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const {
    company_id,
    city_id,
    outletName,
    ownerName,
    phoneNumber,
    vatNumber,
    geoLat,
    geoLong,
    status_control,
  } = req.body;
  try {
    const repo = (await conn).getRepository(Outlet);
    const repo2 = (await conn).getRepository(Company);
    const repo3 = (await conn).getRepository(City);
    let outlet = await repo.find({ where: { id: id } });
    if (!outlet || Object.keys(outlet).length === 0) {
      return res.status(404).json({ outlet, msg: "not Found" });
    }
    if (
      !(
        company_id ||
        city_id ||
        outletName ||
        ownerName ||
        phoneNumber ||
        vatNumber ||
        geoLong ||
        geoLong ||
        status_control
      )
    ) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }
    let city = null,
      company = null;
    if (city_id) {
      city = await repo3.findOne({ where: { id: city_id } });
      if (!city || Object.keys(city).length == 0) {
        return res.status(400).json({ msg: "error with city", city });
      }
    }
    if (company_id) {
      company = await repo2.findOne({ where: { id: company_id } });

      if (!company || Object.keys(company).length == 0) {
        return res.status(400).json({ msg: "error with company", company });
      }
    }

    outlet[0].city_id = city || outlet[0].city_id;
    outlet[0].company_id = company || outlet[0].company_id;
    outlet[0].outletName = outletName || outlet[0].outletName;
    outlet[0].ownerName = ownerName || outlet[0].ownerName;
    outlet[0].phoneNumber = phoneNumber || outlet[0].phoneNumber;
    outlet[0].vatNumber = vatNumber || outlet[0].vatNumber;
    outlet[0].geoLat = geoLat || outlet[0].geoLat;
    outlet[0].geoLong = geoLong || outlet[0].geoLong;
    outlet[0].status_control = status_control || outlet[0].status_control;

    await outlet[0].save();
    res.status(200).json({ outlet: outlet[0], msg: "Successfully updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Outlet);
    let outlet = await repo.find({ where: { id: id } });
    if (!outlet || Object.keys(outlet).length === 0) {
      return res.status(404).json({ outlet, msg: "not Found" });
    }
    outlet[0].status_control = 0;
    await outlet[0].save();
    res.status(202).json({ outlet, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
