// import Prisma from './src/database/connection.js';

// try {
//   const users = await Prisma.user.findMany({
//     select: {
//       id: true,
//       userId: true,
//       name: true,
//       passwordHash: true,
//       role: true,
//       isActive: true,
//       deletedAt: true,
//     },
//   });

//   console.table(users);
// } catch (error) {
//   console.error(error);
// } finally {
//   await Prisma.$disconnect();
// }



// import Prisma from './src/database/connection.js';

// try {
//  const work = await Prisma.work.create({
//   data: {
//     customerId:1,
//     serviceId: 1,
//     acknowledgementNumber: "ACK003",
//     workDate: new Date(),
//     charge: 500,
//     discountAmount: 0,
//     finalAmount: 500,
//     createdById:2,
//   },
// });

// console.log(work);
// } catch (error) {
//   console.error(error);
// } finally {
//   await Prisma.$disconnect();
// }


// const service = await prisma.service.create({
//   data: {
//     name: "Birth Certificate",
//     defaultCharge: 500,
//   },
// });

// console.log(service);

// const payment = await prisma.payment.create({
//   data: {
//     workId: work.id,
//     charge: 500,
//     discountAmount: 0,
//     paid: 200,
//     finalAmount: 500,
//     remaining: 300,
//     paymentMethod: "CASH",
//     paymentStatus: "BALANCE",
//     createdById: user.id,
//   },
// });

// console.log(payment);



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








import Prisma from './src/database/connection.js';

const logs = [
  {
    userId: 1,
    action: 'STAFF_CREATED',
    entityType: 'STAFF',
    entityId: 2,
    details: 'New staff member created',
  },
  {
    userId: 1,
    action: 'STAFF_UPDATED',
    entityType: 'STAFF',
    entityId: 2,
    details: 'Staff member information updated',
  },
  {
    userId: 1,
    action: 'STAFF_STATUS_UPDATED',
    entityType: 'STAFF',
    entityId: 2,
    details: 'Staff status changed to ACTIVE',
  },
  {
    userId: 2,
    action: 'LOGIN_SUCCESS',
    entityType: 'AUTH',
    entityId: 2,
    details: 'Staff logged in successfully',
  },
];

async function main() {
  await Prisma.activityLog.createMany({
    data: logs,
  });

  console.log('Activity logs inserted successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await Prisma.$disconnect();
  });