import Prisma from '../../database/connection.js';

export const getWorks = async ({ search, filter }) => {
    const where = {
        deletedAt: null
    };

    if (filter === 'COMPLETED') {
        where.completed = true;
    }

    if (filter === 'DELIVERED') {
        where.delivered = true;
    }

    if (filter === 'PENDING') {
        where.status = 'PENDING';
    }

    if (filter === 'ACCEPTED') {
        where.status = 'ACCEPTED';
    }

    if (filter === 'REJECTED') {
        where.status = 'REJECTED';
    }

    if (filter === 'DEADLINE_EXCEEDED') {
        where.deadline = {
            lt: new Date()
        };
        where.completed = false;
    }

    if (search?.trim()) {
        const searchText = search.trim();
        const searchParts = searchText.split(/\s+/);

        const searchConditions = [
            {
                acknowledgementNumber: {
                    contains: searchText
                }
            },
            {
                reference: {
                    contains: searchText
                }
            },
            {
                status: {
                    contains: searchText
                }
            },
            {
                customer: {
                    name: {
                        contains: searchText
                    }
                }
            },
            {
                customer: {
                    surname: {
                        contains: searchText
                    }
                }
            },
            {
                service: {
                    name: {
                        contains: searchText
                    }
                }
            }
        ];

        if (searchParts.length >= 2) {
            searchConditions.push({
                customer: {
                    AND: [
                        {
                            name: {
                                contains: searchParts[0]
                            }
                        },
                        {
                            surname: {
                                contains: searchParts[1]
                            }
                        }
                    ]
                }
            });
        }

        where.OR = searchConditions;
    }

    return await Prisma.work.findMany({
        where,

        select: {
            id: true,
            acknowledgementNumber: true,
            reference: true,
            workDate: true,
            deadline: true,
            status: true,
            completed: true,
            delivered: true,
            processed: true,

            customer: {
                select: {
                    id: true,
                    name: true,
                    surname: true
                }
            },

            service: {
                select: {
                    id: true,
                    name: true
                }
            }
        },

        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const getWorkById = async (id) => {
    return await Prisma.work.findFirst({
        where: {
            id,
            deletedAt: null
        },
        select: {
            id: true,
            acknowledgementNumber: true,
            reference: true,
            workDate: true,
            deadline: true,
            remark: true,
            charge: true,
            discountAmount: true,
            finalAmount: true,
            status: true,
            processed: true,
            completed: true,
            delivered: true,

            customer: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    phone: true
                }
            },

            service: {
                select: {
                    id: true,
                    name: true,
                    defaultCharge: true
                }
            }
        }
    });
};

export const updateWork = async (id, data) => {
    return await Prisma.work.update({
        where: {
            id
        },
        data: {
            ...(data.remark !== undefined && {
                remark: data.remark
            }),

            ...(data.status !== undefined && {
                status: data.status
            }),

            ...(data.delivered !== undefined && {
                delivered: data.delivered
            }),

            ...(data.processed !== undefined && {
                processed: data.processed
            }),

            ...(data.completed !== undefined && {
                completed: data.completed
            })
        },

        select: {
            id: true,
            acknowledgementNumber: true,
            reference: true,
            workDate: true,
            deadline: true,
            remark: true,
            charge: true,
            discountAmount: true,
            finalAmount: true,
            status: true,
            processed: true,
            completed: true,
            delivered: true,

            customer: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    phone: true
                }
            },

            service: {
                select: {
                    id: true,
                    name: true,
                    defaultCharge: true
                }
            }
        }
    });
};