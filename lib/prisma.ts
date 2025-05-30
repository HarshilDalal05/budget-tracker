import { PrismaClient } from "@/prisma/app/generated/prisma/client";

const prismaClientSingleTon = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line  no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleTon>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleTon();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
