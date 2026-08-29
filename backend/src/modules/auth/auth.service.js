import * as repository from './auth.repository.js';

export const getOne = async (id) => {
    return await repository.findById(id);
};

export const create = async (data) => {
    return await repository.create(data);
};
