import * as repository from './payment.repository.js';
import { PAYMENT_STATUS } from '../../enum/payments.js';

export const getOnePayment = async (id) => {
  return await repository.findById(id);
};

export const getAllPayment = async () => {

  const works = await repository.findWorks();

  return works.map((work) => {
    const paymentStatus = work.payments[0]?.paymentStatus ?? null;

    return {
      id: work.id,
      Acknowledgement: work.acknowledgementNumber,
      name: `${work.customer.name} ${work.customer.surname}`,
      reference: work.reference ?? null,
      service: work.service.name,
      Payment_status: paymentStatus,
      reminder: paymentStatus !== PAYMENT_STATUS.COMPLETED,
    };
  });
};

export const create = async (data) => {
  return await repository.create(data);
};
