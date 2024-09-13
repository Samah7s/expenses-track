import jwt from "jsonwebtoken";

export function generateAccessToken(id: number, email: string) {
  return jwt.sign(
    {
      id,
      email,
    },
    "some random access token secret",
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(id: number) {
  return jwt.sign({ id }, "some random refresh token secret", {
    expiresIn: "14d",
  });
}
