import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';
import {
  generateStaffId,
  generatePassword,
} from '../../utils/staff.utils.js';
import {addActivityLog} from '../activity-logs/activity.service.js';
import {
  createStaff,
  findAllStaff,
  findStaffById,
  findStaffCredentialsById,
  updateStaff,
  findStaffByUserId,
  updateStaffPassword

} from './staff.repository.js';

const createStaffError = (message, statusCode) => {
  throw new AppError(message, statusCode, MODULES.STAFF);
};


export const addStaff = async ({ name, userId, password },createdById) => {
  if (!name || !name.trim()) {
    createStaffError('Staff name is required', 400);
  }

  let finalUserId = userId?.trim();

 
  if (!finalUserId) {
    let existingStaff;

    do {
      finalUserId = generateStaffId();
      existingStaff = await findStaffByUserId(finalUserId);
    } while (existingStaff);
  } else {
    const existingStaff = await findStaffByUserId(finalUserId);

    if (existingStaff) {
      createStaffError('Staff ID already exists', 409);
    }
  }

  const finalPassword =
    password && password.trim()
      ? password.trim()
      : generatePassword();

  const staff = await createStaff({
    userId: finalUserId,
    name: name.trim(),
    passwordHash: finalPassword,
    role: 'STAFF',
    isActive: true,
  });

  await addActivityLog({
    userId:createdById,
    action:'STAFF_CREATED',
    entityType:'STAFF',
    entityId:staff.id,
    details:`Staff ${staff.name} was created`
  });

  return {
    ...staff,
    password: finalPassword,
  };
};

export const getAllStaff = async () => {
  return findAllStaff();
};

export const getStaffById = async (id) => {
  const staff = await findStaffById(Number(id));

  if (!staff) {
    createStaffError('Staff not found', 404);
  }

  return staff;
};

export const getStaffCredentials = async (id) => {
  const staff = await findStaffCredentialsById(Number(id));

  if (!staff) {
    createStaffError('Staff not found', 404);
  }

  return {
    id: staff.id,
    userId: staff.userId,
    name: staff.name,
    password: staff.passwordHash,
  };
};

export const editStaff = async (id, data,updatedById) => {
  const staff = await findStaffById(Number(id));

  if (!staff) {
    createStaffError('Staff not found', 404);
  }

  const updateData = {};

  if (data.name !== undefined) {
    if (!data.name.trim()) {
      createStaffError('Staff name cannot be empty', 400);
    }

    updateData.name = data.name.trim();
  }

  if (data.password !== undefined) {
    if (!data.password.trim()) {
      createStaffError('Password cannot be empty', 400);
    }

    updateData.passwordHash = data.password;
  }

  if (Object.keys(updateData).length === 0) {
    createStaffError('No valid fields provided for update', 400);
  }

   const updatedStaff = await updateStaff(Number(id), updateData);

  await addActivityLog({
    userId: updatedById,
    action: 'STAFF_UPDATED',
    entityType: 'STAFF',
    entityId: Number(id),
    details: `Staff ${updatedStaff.name} was updated`,
  });

  return updatedStaff;
};

export const changeStaffStatus = async (id, isActive,updatedById) => {
  const staff = await findStaffById(Number(id));

  if (!staff) {
    createStaffError('Staff not found', 404);
  }

  if (typeof isActive !== 'boolean') {
    createStaffError('isActive must be true or false', 400);
  }

  const updatedStaff = await updateStaff(
    Number(id),
    { isActive }
  );

  await addActivityLog({
    userId: updatedById,
    action: 'STAFF_STATUS_UPDATED',
    entityType: 'STAFF',
    entityId: Number(id),
    details: `Staff status changed to ${
      isActive ? 'ACTIVE' : 'INACTIVE'
    }`,
  });

  return updatedStaff;
};

export const changeStaffPassword = async ({
  id,
  currentPassword,
  newPassword,
}) => {
  if (!currentPassword || !currentPassword.trim()) {
    createStaffError('Current password is required', 400);
  }

  if (!newPassword || !newPassword.trim()) {
    createStaffError('New password is required', 400);
  }

  if (newPassword.trim().length < 6) {
    createStaffError(
      'New password must be at least 6 characters',
      400
    );
  }

  if (currentPassword.trim() === newPassword.trim()) {
    createStaffError(
      'New password must be different from current password',
      400
    );
  }

  const staff = await findStaffCredentialsById(id);

  if (!staff) {
    createStaffError('Staff not found', 404);
  }

  if (staff.passwordHash !== currentPassword.trim()) {
    createStaffError('Current password is incorrect', 401);
  }

  const updatedStaff = await updateStaffPassword(
    id,
    newPassword.trim()
  );

  await addActivityLog({
    userId: id,
    action: 'PASSWORD_CHANGED',
    entityType: 'AUTH',
    entityId: id,
    details: 'Staff password was changed',
  });


  return updatedStaff;
};