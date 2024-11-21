import { PrismaClient } from "@prisma/client";
import { UserSeed } from "./seeds/users";
import { ProductsSeed } from "./seeds/products";
import { DepartmentSeed } from "./seeds/departments";
import { CollaboratorsSeed } from "./seeds/collaborators";
const prismaClient = new PrismaClient();

async function main() {
  console.log("Start seeding ...");
  console.log("Seeding users ...");

  await Promise.all(
    UserSeed.map(async (data) => {
      await prismaClient.user.upsert({
        where: { user: data.user },
        create: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          user: data.user,
          passwd: data.passwd,
          level: data.level
        },
        update: {},
      }).then(data => {
        console.log('User --> ' + data.first_name + " " + data.last_name + " created");
      }).catch(e => {
        console.log(e);
      });
    })
  ).then(() => { console.log("///---------------------------------------------//\n Users ok \n\n") });

  await Promise.all(
    ProductsSeed.map(async (data) => {
      await prismaClient.$transaction([
        prismaClient.type.upsert({
          where: { type: data.type },
          create: {
            type: data.type,
          },
          update: {}
        }),
        prismaClient.service.upsert({
          where: { service: data.service },
          create: {
            service: data.service,
          },
          update: {}
        }),
        prismaClient.product.upsert({
          where: {
            product_service_type_size: {
              product: data.product,
              service: data.service,
              type: data.type,
              size: data.size
            }
          },
          create: {
            product: data.product,
            type: data.type,
            service: data.service,
            size: data.size,
            unitary_value: data.unitary_value,
            finality: data.finality,
          },
          update: {}
        })
      ]).then(async (prod) => {
        console.log('Product --> ' + prod[2].product + " " + prod[2].size + " created");
        if (data.barcode) {
          await prismaClient.barCode.upsert({
            where: { code: data.barcode },
            create: {
              code: data.barcode,
              product_id: prod[2].id
            },
            update: {}
          }).then(barcode => {
            console.log('Barcode --> ' + barcode.code + " created");
          }).catch(e => {
            console.log(e);
          });
        }
      }).catch(e => {
        console.log(e);
      });

    })
  ).then(() => { console.log("///---------------------------------------------//\n Products ok \n\n") });

  await Promise.all(
    DepartmentSeed.map(async (data) => {
      await prismaClient.department.upsert({
        where: { department: data },
        create: {
          department: data,
        },
        update: {}
      }).then(data => {
        console.log('Department --> ' + data.department + " created");
      }).catch(e => {
        console.log(e);
      })
    })
  ).then(() => { console.log("///---------------------------------------------//\n departments ok \n\n") });


  await Promise.all(
    CollaboratorsSeed.map(async (data) => {
      await prismaClient.collaborator.upsert({
        where: { cpf: data.cpf },
        create: {
          cpf: data.cpf,
          name: data.name,
          department: data.department,
          type: data.type,
        },
        update: {}
      }).then(data => {
        console.log('Collaborator --> ' + data.name + " created");
      }).catch(e => {
        console.log(e);
      }
      )
    })
  ).then(() => { console.log("///---------------------------------------------//\n Collaborators ok \n\n") });
}

main()
  .catch(async (e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
