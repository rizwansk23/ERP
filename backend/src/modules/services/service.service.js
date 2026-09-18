import * as repository from './service.repository.js';

export const getAllServices = async (isStaff) => {
  const services = await repository.findServices();

  if (isStaff)
    return services.map((service) => {
      return {
        Id: service.id,
        Name: service.name,
        charge: service.defaultCharge,
      };
    });

  return services.map((service) => {
    return {
      Id: service.id,
      Name: service.name,
      charge: service.defaultCharge,
      Isactive: service.isActive,
    };
  });
};

export const create = async (data) => {
  return await repository.create(data);
};
