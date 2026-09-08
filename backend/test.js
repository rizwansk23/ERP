import Prisma from './src/database/connection.js';

try {
 const work = await Prisma.work.create({
  data: {
    customerId:1,
    serviceId: 1,
    acknowledgementNumber: "ACK002",
    workDate: new Date(),
    charge: 500,
    discountAmount: 0,
    finalAmount: 500,
    createdById:1,
  },
});

console.log(work);
} catch (error) {
  console.error(error);
} finally {
  await Prisma.$disconnect();
}


// const service = await prisma.service.create({
//   data: {
//     name: "Birth Certificate",
//     defaultCharge: 500,
//   },
// });

// console.log(service);

const payment = await Prisma.payment.create({
  data: {
    workId: 1,
    charge: 500,
    discountAmount: 0,
    paid: 200,
    finalAmount: 500,
    remaining: 300,
    paymentMethod: "CASH",
    paymentStatus: "BALANCE",
    createdById: 1,
  },
});

console.log(payment);



// const payment = await prisma.payment.create({
//   data: {
//     workId: work.id,

//     charge: work.charge,
//     discountAmount: work.discountAmount,
//     paid: paymentAmount,
//     finalAmount: work.finalAmount,
//     remaining: work.finalAmount - paymentAmount,

//     paymentMethod: "CASH",
//     paymentStatus:
//       paymentAmount >= work.finalAmount ? "COMPLETED" : "BALANCE",

//     reference: "CASH-001",
//     receiptNumber: `REC-${Date.now()}`,

//     createdById: user.id,
//   },
// });

// console.log("Payment created:", payment);

// const customer = await prisma.customer.create({
//   data: {
//     name: "Karan",
//     surname: "Yadav",
//     phone: `987${Date.now().toString().slice(-7)}`,
//   },
// });