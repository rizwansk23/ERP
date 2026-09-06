import * as repository from './payment.repository.js';
import { PAYMENT_STATUS } from '../../enum/payments.js';
import { formatDate } from '../../utils/helpers.js';
import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

export const getOnePayment = async (id) => {
  const customer_payment = await repository.findById(id);
  console.log(customer_payment);

  const payment = customer_payment.payments[0];

  return {
    Id: customer_payment.id,
    Acknowledgement: customer_payment.acknowledgementNumber,
    Name: `${customer_payment.customer.name} ${customer_payment.customer.surname}`,
    Reference: customer_payment.reference ?? null,
    Phone: customer_payment.customer.phone,
    Discount_Amount: customer_payment.discountAmount,
    Final_Amount: customer_payment.finalAmount,
    Service: customer_payment.service.name,
    Remaining: payment?.remaining ?? null,
    Total_Paid: customer_payment.payments.reduce((total, payment) => total + payment.paid, 0),
    Payment_status: payment?.paymentStatus ?? null,
    Reminder: payment?.paymentStatus !== PAYMENT_STATUS.COMPLETED,
    Payment_History: customer_payment.payments.map((payment) => {
      return {
        Payment_method: payment.paymentMethod,
        Paid: payment.paid,
        Created_At: formatDate(payment.createdAt),
      };
    }),
  };
};

export const getAllPayment = async () => {
  const works = await repository.findWorks();

  return works.map((work) => {
    const paymentStatus = work.payments[0]?.paymentStatus ?? null;

    return {
      Id: work.id,
      Acknowledgement: work.acknowledgementNumber,
      Name: `${work.customer.name} ${work.customer.surname}`,
      Reference: work.reference ?? null,
      Service: work.service.name,
      Payment_status: paymentStatus,
      Reminder: paymentStatus !== PAYMENT_STATUS.COMPLETED,
    };
  });
};

export const createPayment = async (workId, amount, paymentMethod, finalAmount) => {
  const remaining = finalAmount - amount;

  if (amount < 0) {
    throw new AppError('Payment amount cannot be negative', 400, MODULES.PAYMENT);
  }

  const paymentStatus =
    remaining === 0
      ? PAYMENT_STATUS.COMPLETED
      : remaining === finalAmount
        ? PAYMENT_STATUS.PENDING
        : PAYMENT_STATUS.BALANCEDUE;

  const add_payment = await repository.AddPayment(
    workId,
    amount,
    paymentMethod,
    remaining,
    paymentStatus,
  );

  return add_payment;
};
