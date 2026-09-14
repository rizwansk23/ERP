import * as repository from './work.repository.js';

export const getAllWork = async ({ page, limit, search }) => {
  const { total, rows : works } = await repository.findAllWork({ page, limit, search });

  const item = works.map((work) => {
    return {
      Id: work.Id,
      Acknowledgement: work.acknowledgementNumber,
      Name: `${work.customer?.name ?? ''} ${work.customer?.surname ?? ''}`.trim(),
      Service: work.service?.name ?? null,
      Status: work.status
    };
  });

  return { total, item };
};

export const create = async (data) => {
  return await repository.create(data);
};
