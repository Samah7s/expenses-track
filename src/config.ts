import { Secret } from "jsonwebtoken";
const config = {
  access_token_secret: process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET_KEY as Secret,
};

export default config;
