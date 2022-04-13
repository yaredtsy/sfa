// const  = require('passport-jwt').
import { Strategy, ExtractJwt } from "passport-jwt";

const passport = require("passport");

interface optsParams {
  jwtFromRequest: Function;
  secretOrKey: string;
}
const opts: optsParams = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "SFAJWT",
};

// passport.use(new Strategy())
