import bcrypt from "bcrypt";
import prisma from "@/database/db";
import { fakerID_ID as faker } from "@faker-js/faker";

const dev = process.env.NODE_ENV === "development";

export const generateArray = (length: number) => Array.from({ length });

const dummyLocation = ["Toko", "Storage"];
const generateRandom = (length: number) =>
  Math.floor(Math.random() * length - 1);
// Function to clean up the database
async function cleanup() {
  try {
    // Delete all records from each table
    await prisma.user.deleteMany();
    await prisma.categoryStockAtLocation.deleteMany();
    await prisma.categoryStock.deleteMany();
    await prisma.category.deleteMany();
    await prisma.product.deleteMany();
    await prisma.location.deleteMany();
    await prisma.companyInformation.deleteMany();

    // Reset auto-increment for each table
    await prisma.$executeRaw`ALTER TABLE users AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE products AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE category AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE ctg_stock AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE ctg_stock_based_location AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE product_location AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE locations AUTO_INCREMENT = 1;`;

    console.log("Database cleaned up successfully");
  } catch (error) {
    console.error("Error cleaning up database:", error);
  }
}

const seed = async () => {
  if (!dev) {
    const data = {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      username: process.env.ADMIN_USERNAME!
    };

    await prisma.companyInformation.create({
      data: {
        id: 1,
        address: process.env.COMPANY_ADDRESS!,
        name: process.env.COMPANY_NAME!,
        tel: process.env.COMPANY_TEL!
      }
    });

    return await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: bcrypt.hashSync(data.password, 12),
        last_seen: new Date(),
        role: "admin"
      }
    });
  }

  console.log(`Start to cleanup..`);

  await cleanup();

  const getPassword = "admin";

  const foundDefaultAdmin = await prisma.user.findFirst({
    where: { id: 1 }
  });

  await prisma.companyInformation.create({
    data: {
      id: 1,
      address: "dev",
      name: "dev",
      tel: "dev"
    }
  });

  if (!foundDefaultAdmin) {
    const fullName = `${faker.person.firstName()} ${faker.person.lastName()}`;

    await prisma.user.create({
      data: {
        email: "admin@access.com",
        last_seen: new Date(),
        password: bcrypt.hashSync(getPassword, 12),
        role: "admin",
        username: "admin"
      }
    });
  }

  const locations = await Promise.all(
    dummyLocation.map(async (location) => {
      return await prisma.location.create({
        data: {
          location_name: location
        }
      });
    })
  );

  const user = await prisma.user.findFirst({
    select: {
      id: true
    }
  });

  console.log("user: ", user);

  const products = await Promise.all(
    generateArray(20).map(async (_, index) => {
      return await prisma.product.create({
        data: {
          name: faker.commerce.product(),
          amount: Number(faker.commerce.price()),
          amount_supplier: Number(faker.commerce.price()),
          supplier: faker.company.name(),
          production_cost: 0,
          origin: "purchase",
          created_by: 1
        }
      });
    })
  );

  await Promise.all(
    generateArray(20).map(async () => {
      return await prisma.productLocation.create({
        data: {
          location_name:
            locations[faker.number.int({ min: 0, max: locations.length - 1 })]
              .location_name,
          product_code:
            products[faker.number.int({ min: 0, max: products.length - 1 })].id
        }
      });
    })
  );

  const embedCategory = await Promise.all(
    products.map(async (product) => {
      return await prisma.category.createMany({
        data: generateArray(4).map(() => ({
          name: faker.commerce.product(),
          product_id: product.id
        }))
      });
    })
  );

  const allCtg = await prisma.category.findMany();
  const createdStock = await Promise.all(
    generateArray(10).map(async () => {
      return await prisma.categoryStock.create({
        data: {
          category_id:
            allCtg[faker.number.int({ min: 0, max: allCtg.length - 1 })].id
        }
      });
    })
  );

  const createdCustomer = await Promise.all(
    generateArray(20).map(async (a, b) => {
      return await prisma.customer.create({
        data: {
          full_name: faker.person.fullName(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          email: faker.internet.email(),
          company: faker.company.name()
        },
        select: {
          id: true
        }
      });
    })
  );

  const documents = await Promise.all(
    generateArray(5).map(async (a, b) => {
      return await prisma.document.create({
        data: {
          is_expired: new Date()
        },
        select: {
          id: true
        }
      });
    })
  );

  const createdOrders = await Promise.all(
    generateArray(20).map(async (a, b) => {
      return await prisma.order.create({
        data: {
          status: "process",
          total_amount: faker.number.int({ max: 99999 }),
          pricing_variant: "normal",
          payment_method: "Cash",
          customer_id:
            createdCustomer[generateRandom(createdCustomer.length)].id,
          document_id: documents[generateRandom(documents.length)].id,
          user_updated_by_id: 1,
          tax_amount: faker.number.int(99999),
          discount_percentage: faker.number.int(100),
          discount_amount: faker.number.int(20)
        },
        select: {
          id: true
        }
      });
    })
  );

  await Promise.all(
    createdStock.map(async (a, idx) => {
      const foundStockLocation = await prisma.categoryStockAtLocation.findFirst(
        {
          where: {
            ctg_stock:
              createdStock[
                faker.number.int({ min: 0, max: createdStock.length - 1 })
              ].id,
            location_name:
              locations[faker.number.int({ min: 0, max: locations.length - 1 })]
                .location_name
          },
          select: {
            id: true,
            ctg_stock: true,
            location_name: true
          }
        }
      );
      if (foundStockLocation) {
        return await prisma.categoryStockAtLocation.update({
          where: { id: foundStockLocation.id },
          data: {
            stock: { increment: faker.number.int({ min: 0, max: 100 }) }
          }
        });
      }

      return await prisma.categoryStockAtLocation.create({
        data: {
          ctg_stock: a.id,
          price: 0,
          location_name:
            locations[faker.number.int({ min: 0, max: locations.length - 1 })]
              .location_name,
          stock: faker.number.int({ min: 0, max: 200 })
        }
      });
    })
  );

  const categoryStockAtLocation =
    await prisma.categoryStockAtLocation.findMany();

  const createdProductOrders = await Promise.all(
    generateArray(10).map(async (a, b) => {
      return await prisma.productOrder.create({
        data: {
          total_amount: faker.number.int({ max: 9999 }),
          order_id: createdOrders[generateRandom(createdOrders.length)].id,
          product_id: products[generateRandom(products.length)].id
        }
      });
    })
  );

  const createdCategoryOrders = await Promise.all(
    generateArray(10).map(async (a, b) => {
      return await prisma.orderCategoryList.create({
        data: {
          total_stock_category: faker.number.int({ max: 100 }),
          category_id:
            categoryStockAtLocation[
              generateRandom(categoryStockAtLocation.length)
            ].id,
          get_from_location_id:
            locations[generateRandom(locations.length)].location_name,
          order_id:
            createdProductOrders[generateRandom(createdProductOrders.length)].id
        }
      });
    })
  );
};

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect PrismaClient
  });
