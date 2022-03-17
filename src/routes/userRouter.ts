import { Router } from "express";
import { User } from "../entity/User";
import { createConnection } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = Router();

const conn = createConnection().then((con) => {
  // con.query("DELETE FROM user_detail WHERE id != 1");
  return con;
});

async function hashPassword(plainPwd) {
  return await bcrypt.hash(plainPwd, 10);
}

async function validatePassword(plainPwd, hashPwd) {
  return await bcrypt.compare(plainPwd, hashPwd);
}


// READ ALL
router.get("/", async (req, res) => {
  try {
    const repo = (await conn).getRepository(User);
    const allUsers = await repo.find();
    return res.status(200).json({ allUsers, msg: "success" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
});


// READ ONE
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.find({ where: { id: id } });
    if (!user || Object.keys(user).length === 0) {
      return res.status(404).json({ user, msg: "not Found" });
    }
    res.status(200).json({ user, msg: "Successfuly fetched" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
});


// POST
router.post("/", async (req, res) => {
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
  if (
    !(
      firstName &&
      lastName &&
      middleName &&
      email &&
      phoneNumber &&
      role &&
      address &&
      position &&
      password
    )
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  try {
    // (await conn).query("DELETE FROM user_detail WHERE id != 1");
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

    return res.status(201).json({ msg: "new user created", user: newUser });
  } catch (err) {
    return res.status(409).json({ msg: "phone or email already exist" });
  }
});

// PATCH
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  let {firstName, lastName, middleName, email, phoneNumber, role, address, position, password} = req.body;
  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.find({ where: { id: id } });
    if (!user || Object.keys(user).length === 0) {
      return res.status(404).json({ user, msg: "not Found" });
    }
    if(!(firstName || middleName || lastName || email || phoneNumber || role || address || position || password)){
      return res.status(400).json({msg: "Please fill in atleast one attribute"});
    }
    if(password){
      password = await hashPassword(password);
    }
    
    user[0].firstName = firstName || user[0].firstName;
    user[0].middleName = middleName || user[0].middleName;
    user[0].lastName = lastName || user[0].lastName;
    user[0].email = email || user[0].email;
    user[0].phoneNumber = phoneNumber || user[0].phoneNumber;
    user[0].address = address || user[0].address;
    user[0].position = position || user[0].position;
    user[0].role = role || user[0].role;
    user[0].password = password || user[0].password;

    await user[0].save();
    res.status(200).json({ user: user[0], msg: "successfully updated" });
  } catch(err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong",  err});
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.find({ where: { id: id } });
    if (!user || Object.keys(user).length === 0) {
      return res.status(404).json({ user, msg: "not Found" });
    }
    user[0].status_control = 0;
    await user[0].save();
    res.status(202).json({ user, msg: "successfully deleted" });
  } catch {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Request body ", req.body)
  try {
    const repo = (await conn).getRepository(User);
    const user = await repo.find({ where: { email: email } });
    if (!user || Object.keys(user).length === 0) {
      return res.status(404).json({ user, msg: "not Found" });
    }
    // check if password matches
    const isMatch = await validatePassword(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Bad data" });
    }
    const token = await jwt.sign(
      JSON.stringify(user[0]),
      process.env.JWT_SECRET || "SFAJWT"
    );
    // res.cookie("auth", token);
    return res.status(200).json({ msg: "logged in", token: token , user: user[0]});
  } catch (err) {
    console.log(err);
    return res.status(500).json({msg: "internal server error"});
  }
});


router.post('/forget-password', async (req, res) =>{
  const {email} = req.body;
  console.log("Request Body", req.body)
  if(!email){
    return res.status(400).json({msg: "Please provide email address of the user to reset the password"});
  }
  try{
    const repo = (await conn).getRepository(User);
    const user = await repo.findOne({where: {email: email}});
    if(!user){
      return res.status(404).json({msg: "Not Found"});
    }
    
    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.middleName} ${user.lastName}`

    }

    const token = await jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET || "SFAJWT");
    const dec = await jwt.verify(token, process.env.JWT_SECRET || "SFAJWT");

    res.json({token, dec, user})
  } catch(err){
    res.status(500).json({msg: "Internal Server Error"});
  }
})
export default router;
