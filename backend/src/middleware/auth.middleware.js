import { asyncHandler } from '../../utils/asyncHandler.js';
export const protect = asyncHandler(async (req, res, next) => {
    next();
});
