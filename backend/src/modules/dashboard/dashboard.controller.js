import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './dashboard.service.js';

export const getOne = asyncHandler(async (req, res) => {
    const data = await service.getOne(req.params.id);
    res.status(200).json({ success: true, data });
});

export const create = asyncHandler(async (req, res) => {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
});
