import { hashSync } from "bcrypt";

export const UserSeed = [
  {
    first_name: "Matheus",
    last_name: "Henrique",
    email: "matheus.henrique4245@gmail.com",
    user: "admin",
    passwd: hashSync("admin", 10),
    level: 3,
  },
];
