import Prisma from "../../database/connection.js";

export const findServices = async () => {

   return await Prisma.service.findMany({
        where : {deletedAt : null}
    })
    
};

export const create = async (data) => {
    // DB Logic here
    return { id: 'new-id', ...data };
};
