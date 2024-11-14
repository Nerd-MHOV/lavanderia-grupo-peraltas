import { User } from "@prisma/client";
import { hashSync } from "bcrypt";

export const UserSeed: Omit<User, "id" | "createdAt" | "updatedAt" >[] = [
  {
    first_name: "Matheus",
    last_name: "Henrique",
    email: "matheus.henrique4245@gmail.com",
    user: "admin",
    passwd: hashSync("admin", 10),
    level: 'dev',
  },
];
