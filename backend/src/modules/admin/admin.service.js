import * as repository from './admin.repository.js';

export const getOne = async (id) => {
    return await repository.findById(id);
};

export const create = async (data) => {
    return await repository.create(data);
};
