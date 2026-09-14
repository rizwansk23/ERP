import * as repository from './work.repository.js';
import { formatDate } from '../../utils/helpers.js';

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

export const create = async (data) => {
  return await repository.create(data);
};
