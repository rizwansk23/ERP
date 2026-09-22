export const findById = async (id) => {
    // DB Logic here
    return { id, name: 'Sample Data' };
};

export const create = async (data) => {
    // DB Logic here
    return { id: 'new-id', ...data };
};
