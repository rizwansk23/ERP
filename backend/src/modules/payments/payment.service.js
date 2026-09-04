import * as repository from './payment.repository.js';
import prisma from '../../config/prisma.js';

export const getOne = async (id) => {
    return await repository.findById(id);
};

export const create = async (data) => {
    return await repository.create(data);
};
