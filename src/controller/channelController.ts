import express from "express";
import status from "http-status-codes";

import { Region } from "entity/Region";
import { createConnection } from "typeorm";
import { Channel } from "entity/Channel";
import { Company } from "entity/Company";
import { User } from "entity/User";

// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM channel WHERE id != 1");
  return con;
});

const CreateChannel = async (req: any, res: express.Response) => {
  const { channelName } = req.body;

  try {
    const repo = (await conn).getRepository(Channel);
    const repo2 = (await conn).getRepository(User);

    const userid = Number(req.user.id);

    const user = await repo2.findOne({ where: { id: userid } });

    const newChannel = repo.create({
      created_by: user,
      channelName,
    });
    await newChannel.save();

    return res.status(status.CREATED).json(newChannel);
  } catch (err) {
    console.log(err);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const GetAllChannel = async (req: express.Request, res: express.Response) => {
  try {
    const repo = (await conn).getRepository(Channel);
    const channels = await repo.find();

    if (channels.length == 0) {
      return res
        .status(status.NOT_FOUND)
        .json({ msg: "Channel table is Empty" });
    }
    res.status(status.OK).json({ channel: channels });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const GetOneChannel = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Channel);
    const channel = await repo.findOne({ where: { id } });

    if (!channel) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    res.status(status.OK).json(channel);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const UpdateChannel = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  const { channelName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Channel);

    const channel = await repo.findOne({ where: { id } });
    if (!channel) {
      return res.status(status.NOT_FOUND).json({ channel, msg: "not Found" });
    }

    channel.channelName = channelName || channel.channelName;
    channel.status_control = status_control || channel.status_control;

    await channel.save();
    res.status(status.OK).json({ channel: channel });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const DeleteChannel = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Channel);
    const channel = await repo.findOne({ where: { id } });

    if (!channel) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    channel.status_control = 0;
    await channel.save();

    res.status(202).json({ channel });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

export {
  CreateChannel,
  GetAllChannel,
  GetOneChannel,
  UpdateChannel,
  DeleteChannel,
};
