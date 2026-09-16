import {
    getWorks,
    getWorkById,
    updateWork
} from './work.repository.js';

import {
    validateWorksQuery,
    validateWorkId,
    validateWorkUpdate
} from './work.validation.js';

export const getWorksService = async (query) => {
    const { search, filter } = validateWorksQuery(query);

    return await getWorks({
        search,
        filter
    });
};

export const getWorkByIdService = async (id) => {
    const workId = validateWorkId(id);

    const work = await getWorkById(workId);

    if (!work) {
        const error = new Error('Work not found');
        error.statusCode = 404;
        throw error;
    }

    return work;
};

export const updateWorkService = async (id, data) => {
    const workId = validateWorkId(id);

    validateWorkUpdate(data);

    const existingWork = await getWorkById(workId);

    if (!existingWork) {
        const error = new Error('Work not found');
        error.statusCode = 404;
        throw error;
    }

    return await updateWork(workId, data);
};