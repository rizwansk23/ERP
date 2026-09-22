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

export const updateWorkStatus = async ({
  work_id,
  status,
  isDelivered,
  isCompleted,
  isProcessed,
  reference,
  customer_name,
  deadline,
}) => {
  const existing = await repository.findWorkById({ work_id });
  if (!existing) {
    throw new AppError(`Work with ID ${work_id} not found`, 404, MODULES.WORKS);
  }

  let customerName;
  if (customer_name !== undefined) {
    const [first, ...rest] = customer_name.split(' ');
    customerName = {
      name: first,
      surname: rest.length > 0 ? rest.join(' ') : (existing.customer?.surname ?? ''),
    };
  }

  return await repository.updateWorkStatusById({
    work_id,
    status,
    isCompleted,
    isDelivered,
    isProcessed,
    reference,
    customerName,
    deadline,
  });
};

export const deleteWork = async ({ work_id }) => {
  const existing = await repository.findWorkById({ work_id });
  if (!existing) {
    throw new AppError(`Work with ID ${work_id} not found`, 404, MODULES.WORKS);
  }

  return repository.deleteWorkById({ work_id });
};
