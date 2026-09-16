const validFilters = [
    'ALL',
    'COMPLETED',
    'DELIVERED',
    'PENDING',
    'DEADLINE_EXCEEDED',
    'ACCEPTED',
    'REJECTED'
];

const validStatuses = [
    'PENDING',
    'ACCEPTED',
    'REJECTED'
];

const allowedUpdateFields = [
    'remark',
    'status',
    'delivered',
    'processed',
    'completed'
];

export const validateWorksQuery = (query) => {
    const filter = query.filter?.toUpperCase() || 'ALL';

    if (!validFilters.includes(filter)) {
        const error = new Error(
            'Invalid filter. Allowed values: ALL, COMPLETED, DELIVERED, PENDING, DEADLINE_EXCEEDED, ACCEPTED, REJECTED'
        );

        error.statusCode = 400;
        throw error;
    }

    return {
        search: query.search?.trim() || '',
        filter
    };
};

export const validateWorkId = (id) => {
    const workId = Number(id);

    if (!Number.isInteger(workId) || workId <= 0) {
        const error = new Error('Invalid work ID');
        error.statusCode = 400;
        throw error;
    }

    return workId;
};

export const validateWorkUpdate = (data) => {
    const receivedFields = Object.keys(data);

    if (receivedFields.length === 0) {
        const error = new Error(
            'At least one field is required for update'
        );

        error.statusCode = 400;
        throw error;
    }

    const invalidFields = receivedFields.filter(
        field => !allowedUpdateFields.includes(field)
    );

    if (invalidFields.length > 0) {
        const error = new Error(
            `Invalid fields: ${invalidFields.join(', ')}. Only remark, status, delivered, processed, and completed can be updated.`
        );

        error.statusCode = 400;
        throw error;
    }

    if (
        data.status !== undefined &&
        !validStatuses.includes(data.status)
    ) {
        const error = new Error(
            'Invalid status. Allowed values: PENDING, ACCEPTED, REJECTED'
        );

        error.statusCode = 400;
        throw error;
    }

    for (const field of ['delivered', 'processed', 'completed']) {
        if (
            data[field] !== undefined &&
            typeof data[field] !== 'boolean'
        ) {
            const error = new Error(
                `${field} must be a boolean`
            );

            error.statusCode = 400;
            throw error;
        }
    }

    if (
        data.remark !== undefined &&
        data.remark !== null &&
        typeof data.remark !== 'string'
    ) {
        const error = new Error(
            'Remark must be a string or null'
        );

        error.statusCode = 400;
        throw error;
    }

    return data;
};