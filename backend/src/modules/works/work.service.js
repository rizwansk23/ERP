import * as repository from './work.repository.js';
import { formatDate } from '../../utils/helpers.js';
import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

export const getAllWorks = async ({ page, limit, search }) => {
  const { total, rows: works } = await repository.findAllWorks({ page, limit, search });

  const item = works.map((work) => {
    return {
      Id: work.Id,
      Acknowledgement: work.acknowledgementNumber,
      Name: `${work.customer?.name ?? ''} ${work.customer?.surname ?? ''}`.trim(),
      Service: work.service?.name ?? null,
      Status: work.status,
    };
  });

  return { total, item };
};

export const getOneWork = async ({ work_id }) => {
  const work_data = await repository.findOneWork({ work_id });

  return {
    Customer_name: `${work_data.customer.name ?? ''} ${work_data.customer.surname ?? ''}`.trim(),
    Argument_number: work_data.acknowledgementNumber,
    Reference: work_data.reference ?? null,
    Service_name: work_data.service.name,
    Assigned_date: formatDate(work_data.createdAt),
    Deadline_date: work_data.deadline && formatDate(work_data.deadline),
    Status: work_data.status,
    IsDeliverd: work_data.delivered,
    IsCompleted: work_data.completed,
  };
};

export const updateWorkStatus = async ({ work_id, status, isDelivered, isCompleted, adminPassword }) => {
  const existing = await repository.findWorkById({ work_id });
  if (!existing) {
    throw new AppError(`Work with ID ${work_id} not found`, 404, MODULES.WORKS);
  }

  const isDeliveredDowngrade = existing.delivered === true && isDelivered === false;
  const isCompletedDowngrade = existing.completed === true && isCompleted === false;

  if (isDeliveredDowngrade || isCompletedDowngrade) {
    if (!adminPassword) {
      throw new AppError(
        'To change delivered/completed from true to false, admin password is required.',
        403,
        MODULES.WORKS,
      );
    }

    const admin = await repository.findActiveAdminByPassword(adminPassword);
    if (!admin) {
      throw new AppError('Invalid admin password.', 403, MODULES.WORKS);
    }
  }

  return await repository.updateWorkStatusById({ work_id, status, isCompleted, isDelivered });
};
