import { Connection } from "typeorm";
import { Nation } from "./src/entity/Nation";
import { User } from "./src/entity/User";
import connection from "./src/config/connection";
import { Region } from "./src/entity/Region";
import { Company } from "./src/entity/Company";
import { Territory } from "./src/entity/Territory";
import { Truck } from "./src/entity/Truck";
import { Route } from "./src/entity/Route";
import { City } from "./src/entity/CityDetail";
import { Outlet } from "./src/entity/Outlet";
import { Channel } from "./src/entity/Channel";
import { Agent } from "./src/entity/Agent";

const userData = {
  firstName: "George",
  middleName: "Smith",
  lastName: "Lucas",
  email: "j@j.com",
  phoneNumber: "09123435670",
  role: 1,
  address: "some location",
  position: "position",
  password: "123abc",
};

const nation = {
  nationCode: "ET",
  nationName: "Ethiopia",
  created_by: 1,
};
export async function seed(connection: Connection) {
  // Seed User data
  const entities = connection.entityMetadatas;
  entities.forEach(async (entity) => {
    const repository = connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  });

  const user = await (await connection)
    .getRepository(User)
    .create(userData)
    .save();

  const nation = await (
    await connection
  )
    .getRepository(Nation)
    .create({
      nationCode: "ET",
      nationName: "Ethiopia",
      created_by: user,
    })
    .save();
  const company = await connection
    .getRepository(Company)
    .create({
      companyCode: "UB",
      companyName: "United Beverage",
      city: "Addis Ababa",
      address: "Nifas Silk Lafto",
      numberOfAgents: 70,
      created_by: user,
      company_nation_id: nation,
    })
    .save();
  const region = await connection
    .getRepository(Region)
    .create({
      regionCode: "BDR",
      regionName: "Bahir Dar",
      company_id: company,
      created_by: user,
    })
    .save();
  const territory = await connection
    .getRepository(Territory)
    .create({
      territoryCode: "LO",
      territoryName: "Logia",
      region_id: region,
      created_by: user,
    })
    .save();
  const truck = await connection
    .getRepository(Truck)
    .create({
      truckCode: "AA-BO-001",
      truckName: "Isuzu by Yenenehe",
      plateNumber: "3-83696",
      territory_id: territory,
      created_by: user,
    })
    .save();
  const route = await connection
    .getRepository(Route)
    .create({
      routeCode: "AA-BO-001-01",
      routeName: "Around Gerji",
      truck_id: truck,
      created_by: user,
    })
    .save();
  const city = await connection
    .getRepository(City)
    .create({
      city: "Addis Ababa",
      subCity: "Bole",
      specificArea: "Gerji",
      region_id: region,
      nation_id: nation,
      created_by: user,
    })
    .save();
  const channel = await connection
    .getRepository(Channel)
    .create({
      channelName: "BAR",
      created_by: user,
    })
    .save();
  const outlet = await connection
    .getRepository(Outlet)
    .create({
      channel_id: channel,
      city_id: city,
      company_id: company,
      created_by: user,
      outletName: "Jo Bar",
      ownerName: "Yohannes Admasu",
      route_id: route,
      geoLat: "1.232",
      geoLong: "-12.32",
      phoneNumber: "+251912323232",
    })
    .save();
  const agent = await connection
    .getRepository(Agent)
    .create({
      agentName: "Yeneneh",
      agentCode: "YT",
      address: "Gerji",
      company_id: company,
      created_by: user,
      email: "yenenh@gmail.com",
      phoneNumber: "+251923232323",
    })
    .save();
}
connection.create().then((con) => {
  seed(con);
});

export default seed;
