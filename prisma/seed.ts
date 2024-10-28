import { PrismaClient } from "@prisma/client";
import { UserSeed } from "./seeds/users";
import { ProductsSeed } from "./seeds/products";

const prismaClient = new PrismaClient();

async function main() {
  console.log("Start seeding ...");
  console.log("Seeding users ...");

  UserSeed.map(async ( data ) => {
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

  ProductsSeed.map(async ( data ) => {
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
        where: { product_service_type_size: { 
          product: data.product, 
          service: data.service, 
          type: data.type, 
          size: data.size 
        } },
        create: {
          product: data.product,
          type: data.type,
          service: data.service,
          size: data.size,
          unitary_value: data.unitary_value
        },
        update: {}
      })
    ]).then(async (prod) => {
      console.log('Product --> ' + prod[2].product + " " +  prod[2].size + " created");
      if ( data.barcode ){
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

}

main()
  .catch(async (e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
