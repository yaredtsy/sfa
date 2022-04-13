import { Router } from "express";
import { createConnection } from "typeorm";
import { Channel } from "../entity/Channel";
import { Company } from "../entity/Company";
import { User } from "../entity/User";
import isAuthenticated from "../Middleware/isAuthenticated";
import { Region } from "../entity/Region";

const router = Router();
// for test purpose
const conn = createConnection().then((con) => {
  // con.query("DELETE FROM channel WHERE id != 1");
  return con;
});

// CREATE/POST
router.post("/", isAuthenticated, async (req: any, res) => {
  const { channelName } = req.body;
  if (!channelName) {
    return res.status(400).json({
      msg: "Please insert Data properly and make sure all fields are filled",
    });
  }

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

    return res
      .status(201)
      .json({ msg: "new channel created", channel: newChannel });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// GET ALL
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const repo = (await conn).getRepository(Channel);
    const channels = await repo.find();
    if (channels.length == 0) {
      return res.status(200).json({ msg: "Channel table is Empty", channels });
    }
    res.status(200).json({ msg: "success", channel: channels });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", err });
  }
});

// GET ONE
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Channel);
    const channel = await repo.find({ where: { id } });
    if (!channel || Object.keys(channel).length === 0) {
      return res.status(404).json({ channel, msg: "not Found" });
    }
    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

// PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  const { channelName, status_control } = req.body;
  try {
    const repo = (await conn).getRepository(Channel);

    const channel = await repo.find({ where: { id } });
    if (!channel || Object.keys(channel).length === 0) {
      return res.status(404).json({ channel, msg: "not Found" });
    }
    if (!(channelName || status_control)) {
      return res.status(400).json({ msg: "no DATA", body: req.body });
    }

    channel[0].channelName = channelName || channel[0].channelName;
    channel[0].status_control = status_control || channel[0].status_control;

    await channel[0].save();
    res.status(200).json({ channel: channel[0], msg: "Successfully updated" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error", err });
  }
});

// DELETE
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(Channel);
    const channel = await repo.find({ where: { id } });
    if (!channel || Object.keys(channel).length === 0) {
      return res.status(404).json({ channel, msg: "not Found" });
    }
    channel[0].status_control = 0;
    await channel[0].save();
    res.status(202).json({ channel, msg: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});

export default router;
