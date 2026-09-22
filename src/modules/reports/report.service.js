

export const getOne = async (id) => {
    return { id, name: 'Sample Data' };
};

export const create = async (data) => {
    return { id: 'new-id', ...data };
};
