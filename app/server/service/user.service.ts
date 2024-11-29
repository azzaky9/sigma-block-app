import prisma from "@/database/db";

const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username
    }
  });
};

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
};

export { findUserByUsername, findUserByEmail };
