import { createConnection } from "typeorm";
import express from "express";

import bcrypt from "bcrypt";

import status from "http-status-codes";

import jwt from "jsonwebtoken";

import { User } from "entity/User";

const conn = createConnection().then((con) => {
  // con.query("DELETE FROM user_detail WHERE id != 1");
  return con;
});

async function hashPassword(plainPwd: string) {
  return bcrypt.hash(plainPwd, 10);
}

async function validatePassword(plainPwd: string, hashPwd: string) {
  return bcrypt.compare(plainPwd, hashPwd);
}

const GetAllUser = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const repo = (await conn).getRepository(User);
    const allUsers = await repo.find();
    return res.status(status.OK).json({ allUsers });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ err });
  }
};

const GetUser = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.find({ where: { id } });

    if (!user || Object.keys(user).length === 0) {
      return res.status(status.NOT_FOUND).json({ user });
    }

    res.status(status.OK).json({ user });
  } catch (err) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server error" });
  }
};

const CreateUser = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const {
    firstName,
    lastName,
    middleName,
    email,
    phoneNumber,
    role,
    address,
    position,
    password,
  } = req.body;

  try {
    const repo = (await conn).getRepository(User);
    const hashedPWD = await hashPassword(password);
    const newUser = repo.create({
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      role,
      address,
      position,
      password: hashedPWD,
    });
    await newUser.save();

    return res.status(status.CREATED).json({ user: newUser });
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ msg: error });
  }
};

const UpdateUser = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const id = Number(req.params.id);
  const {
    firstName,
    lastName,
    middleName,
    email,
    phoneNumber,
    role,
    address,
    position,
    password,
  } = req.body;

  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.findOne({ where: { id } });
    if (!user || Object.keys(user).length === 0) {
      return res.status(status.NOT_FOUND).json({ msg: "User Not Found" });
    }
    if (
      !(
        firstName ||
        middleName ||
        lastName ||
        email ||
        phoneNumber ||
        role ||
        address ||
        position ||
        password
      )
    ) {
      return res
        .status(status.NOT_FOUND)
        .json({ msg: "Please fill in atleast one attribute" });
    }
    if (password) {
      const hashedpassword = await hashPassword(password);
    }

    user.firstName = firstName || user.firstName;
    user.middleName = middleName || user.middleName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.position = position || user.position;
    user.role = role || user.role;
    user.password = password || user.password;

    await user.save();
    res.status(status.OK).json({ user, msg: "successfully updated" });
  } catch (err) {
    console.log(err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong", err });
  }
};

const DeleteUser = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const id = Number(req.params.id);

  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.findOne({ where: { id } });

    if (!user) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }
    user.status_control = 0;
    await user.save();
    res.status(status.OK).json({ user });
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
};

const Login = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const { email, password } = req.body;
  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.findOne({ where: { email } });

    if (!user) {
      return res.status(status.NOT_FOUND).json({ msg: "not Found" });
    }

    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Bad data" });
    }
    const token = await jwt.sign(
      JSON.stringify(user),
      process.env.JWT_SECRET || "SFAJWT"
    );
    // res.cookie("auth", token);
    return res.status(status.OK).json({ token, user });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: error });
  }
};

const forgetPassword = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const { email } = req.body;

  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.findOne({ where: { email } });
    if (!user) {
      return res.status(status.NOT_FOUND).json({ msg: "Not Found" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.middleName} ${user.lastName}`,
    };

    const token = await jwt.sign(
      JSON.stringify(payload),
      process.env.JWT_SECRET || "SFAJWT"
    );
    const dec = await jwt.verify(token, process.env.JWT_SECRET || "SFAJWT");

    res.json({ token, dec, user });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export {
  GetAllUser,
  GetUser,
  CreateUser,
  UpdateUser,
  DeleteUser,
  Login,
  forgetPassword,
};
