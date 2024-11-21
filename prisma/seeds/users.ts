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
  {
    first_name: "Yam",
    last_name: "Rikher",
    email: "yam@yam.com",
    user: "yam",
    passwd: hashSync("yam", 10),
    level: 'admin',
  },
  {
    first_name: "Lavanderia",
    last_name: "Gestão",
    email: "lavanderia@lavanderia.com",
    user: "lavanderia",
    passwd: hashSync("lavanderia", 10),
    level: 'user',
  },
  {
    first_name: "Balcão",
    last_name: "Lavanderia",
    email: "bacao@bacao.com",
    user: "balcão",
    passwd: hashSync("balcão", 10),
    level: 'user',
  },
];
