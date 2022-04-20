import express from 'express';
import status from "http-status-codes";

import { createConnection } from "typeorm";
import { Agent } from "entity/Agent";
import { Company } from "entity/Company";
import { User } from "entity/User";

import { Region } from "entity/Region";

// for test purpose
const conn = createConnection().then((con) => {
    // con.query("DELETE FROM agent WHERE id != 1");
    return con;
  });

const createAgent = async(req: any, res: express.Response) => {
    const {
        agentName,
        agentCode,
        address,
        company_id,
        email,
        phoneNumber,
        region_id,
      } = req.body;

    
      try {
        const repo = (await conn).getRepository(Agent);
        const repo2 = (await conn).getRepository(User);
        const repo3 = (await conn).getRepository(Company);

        const region = await (await conn)
          .getRepository(Region)
          .findOne({ where: { id: region_id } });

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
          region_id: region,
        });

        await newAgent.save();
    
        return res.status(status.CREATED).json(newAgent );
      } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
      }
}

const getAllAgent = async(req: express.Request, res: express.Response)=>{
    try {
        const repo = (await conn).getRepository(Agent);
        const agents = await repo.find();

        res.status(status.OK).json({ agents });
      } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong" });
      }
}

const getAgent = async (req: express.Request, res:express.Response) =>{

    const id = Number(req.params.id);

    try {
      const repo = (await conn).getRepository(Agent);
      const agent = await repo.findOne({ where: { id } });

      if (!agent) {
        return res.status(404).json({ msg: "not Found" });
      }

      res.status(status.OK).json(agent);
    } catch (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server error" });
    }
}

const updateAgent = async (req: express.Request, res: express.Response)=>{
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
  
      const agent = await repo.findOne({ where: { id } });
      if (!agent ) {
        return res.status(404).json({ agent, msg: "not Found" });
      }

      let company = null;
      let region = null;
  
      if (company_id) {
        company = await repo2.findOne({ where: { id: company_id } });
  
        if (!company ) {
          return res.status(400).json({ msg: "error with company", company });
        }
      }
      if (region_id) {
        region = await (await conn)
          .getRepository(Region)
          .findOne({ where: { id: region_id } });
  
        if (!region || Object.keys(region).length == 0) {
          return res.status(400).json({ msg: "error with region", company });
        }
      }
  
      agent.company_id = company || agent.company_id;
      agent.region_id = region || agent.region_id;
      agent.agentCode = agentCode || agent.agentCode;
      agent.agentName = agentName || agent.agentName;
      agent.phoneNumber = phoneNumber || agent.phoneNumber;
      agent.email = email || agent.email;
      agent.address = address || agent.address;
      agent.status_control = status_control || agent.status_control;
  
      await agent.save();
      res.status(status.OK).json({ agent });
    } catch (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server error", });
    }
}

const deleteAgent = async(req: express.Request, res: express.Response)=>{
    const id = Number(req.params.id);

    try {
      const repo = (await conn).getRepository(Agent);
      const agent = await repo.findOne({ where: { id } });

      if (!agent) {
        return res.status(status.NOT_FOUND).json({ msg: "not Found" });
      }
      agent.status_control = 0;
      await agent.save();

      res.status(status.OK).json({ agent});
    } catch (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server error" });
    }
}

export {createAgent,getAllAgent,getAgent,updateAgent,deleteAgent}