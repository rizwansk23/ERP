import {
    getWorksService,
    getWorkByIdService,
    updateWorkService
} from './work.service.js';

export const getWorks = async (req, res) => {
    try {
        const works = await getWorksService(req.query);

        return res.status(200).json({
            success: true,
            message: 'Works fetched successfully',
            data: works
        });
    } catch (error) {
        console.error('Get works error:', error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to fetch works'
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const work = await getWorkByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Work fetched successfully',
            data: work
        });
    } catch (error) {
        console.error('Get work error:', error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to fetch work'
        });
    }
};

export const update = async (req, res) => {
    try {
        const work = await updateWorkService(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Work updated successfully',
            data: work
        });
    } catch (error) {
        console.error('Update work error:', error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to update work'
        });
    }
};