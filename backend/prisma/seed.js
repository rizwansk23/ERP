import Prisma from '../src/database/connection.js';

async function main() {
  console.log('Seeding database...');

  // Clean in FK-safe order
  await Prisma.activityLog.deleteMany();
  await Prisma.loginSession.deleteMany();
  await Prisma.payment.deleteMany();
  await Prisma.work.deleteMany();
  await Prisma.customer.deleteMany();
  await Prisma.service.deleteMany();
  await Prisma.backupLog.deleteMany();
  await Prisma.businessSetting.deleteMany();
  await Prisma.ackCounter.deleteMany();
  await Prisma.user.deleteMany();

  // ---------------------------------------------------------------
  // 1. USERS — 1 ADMIN + 4 STAFF (plaintext passwordHash per auth.service)
  // ---------------------------------------------------------------
  const admin = await Prisma.user.create({
    data: {
      userId: 'ADMIN001',
      name: 'Administrator',
      passwordHash: 'admin123',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const staffData = [
    { userId: 'STAFF001', name: 'Rahul Patil', passwordHash: 'staff123' },
    { userId: 'STAFF002', name: 'Priya Sharma', passwordHash: 'staff123' },
    { userId: 'STAFF003', name: 'Amit Deshmukh', passwordHash: 'staff123' },
    { userId: 'STAFF004', name: 'Sneha Pawar', passwordHash: 'staff123' },
  ];

  const staff = [];
  for (const s of staffData) {
    staff.push(
      await Prisma.user.create({
        data: { ...s, role: 'STAFF', isActive: true },
      })
    );
  }
  console.log(`Users: admin(${admin.userId}) + ${staff.length} staff`);

  // ---------------------------------------------------------------
  // 2. BUSINESS SETTINGS (single row)
  // ---------------------------------------------------------------
  await Prisma.businessSetting.create({
    data: {
      businessName: 'Maha e-Seva Kendra',
      ownerName: 'Government of Maharashtra',
      businessLogo: null,
      businessPhone: '9876543210',
      appLockKey: '1234',
    },
  });

  // ---------------------------------------------------------------
  // 3. SERVICES — typical Setu / CSC services
  // ---------------------------------------------------------------
  const servicesData = [
    { name: 'Birth Certificate', defaultCharge: 500 },
    { name: 'Death Certificate', defaultCharge: 500 },
    { name: 'Domicile Certificate', defaultCharge: 600 },
    { name: 'Caste Certificate', defaultCharge: 550 },
    { name: 'Income Certificate', defaultCharge: 550 },
    { name: 'Non-Creamy Layer Certificate', defaultCharge: 700 },
    { name: 'PAN Card Application', defaultCharge: 400 },
    { name: 'Aadhaar Update', defaultCharge: 300 },
    { name: 'Passport Application', defaultCharge: 1500 },
    { name: 'Driving License', defaultCharge: 1200 },
  ];

  const services = [];
  for (const s of servicesData) {
    services.push(await Prisma.service.create({ data: s }));
  }
  console.log(`Services: ${services.length}`);

  // ---------------------------------------------------------------
  // 4. CUSTOMERS
  // ---------------------------------------------------------------
  const customersData = [
    { name: 'Karan', surname: 'Yadav', phone: '9876543210' },
    { name: 'Suresh', surname: 'Gupta', phone: '9812345678' },
    { name: 'Meena', surname: 'Jadhav', phone: '9823456789' },
    { name: 'Vikram', surname: 'Singh', phone: '9834567890' },
    { name: 'Anita', surname: 'More', phone: '9845678901' },
    { name: 'Rajesh', surname: 'Kumar', phone: '9856789012' },
    { name: 'Sunita', surname: 'Rane', phone: '9867890123' },
    { name: 'Mohan', surname: 'Shinde', phone: '9878901234' },
    { name: 'Kavita', surname: 'Nair', phone: '9889012345' },
    { name: 'Deepak', surname: 'Pawar', phone: '9890123456' },
  ];

  const customers = [];
  for (const c of customersData) {
    customers.push(await Prisma.customer.create({ data: c }));
  }
  console.log(`Customers: ${customers.length}`);

  // ---------------------------------------------------------------
  // 5. WORKS (ACK-2026-1 ... N)
  // ---------------------------------------------------------------
  const year = new Date().getFullYear();
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };
  const daysAhead = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  };

  // [customerIdx, serviceIdx, charge, discount, status, processed, completed, delivered, createdByIdx, ageDays, deadlineInDays]
  const worksPlan = [
    [0, 0, 500, 0, 'ACCEPTED', true, true, true, 0, 20, 10],
    [1, 2, 600, 50, 'ACCEPTED', true, true, false, 1, 15, 15],
    [2, 3, 550, 0, 'ACCEPTED', true, false, false, 2, 12, 30],
    [3, 6, 400, 0, 'PENDING', false, false, false, 1, 5, 10],
    [4, 1, 500, 100, 'ACCEPTED', true, false, false, 3, 8, 30],
    [5, 8, 1500, 0, 'PENDING', false, false, false, 2, 3, 60],
    [6, 4, 550, 50, 'REJECTED', false, false, false, 1, 9, null],
    [7, 9, 1200, 200, 'ACCEPTED', true, true, true, 0, 25, 10],
    [8, 7, 300, 0, 'ACCEPTED', true, true, false, 3, 6, 10],
    [9, 5, 700, 0, 'PENDING', false, false, false, 2, 2, 30],
    [0, 4, 550, 0, 'ACCEPTED', true, false, false, 1, 4, 30],
    [2, 6, 400, 50, 'ACCEPTED', true, true, true, 0, 30, 10],
  ];

  const works = [];
  for (let i = 0; i < worksPlan.length; i++) {
    const [ci, si, charge, discount, status, processed, completed, delivered, staffIdx, age, dl] = worksPlan[i];
    const seq = i + 1;
    works.push(
      await Prisma.work.create({
        data: {
          customerId: customers[ci].id,
          serviceId: services[si].id,
          acknowledgementNumber: `ACK-${year}-${seq}`,
          reference: `REF-${year}-${String(seq).padStart(4, '0')}`,
          workDate: daysAgo(age),
          deadline: dl === null ? null : daysAhead(dl),
          remark: status === 'REJECTED' ? 'Documents incomplete — asked to re-submit' : `Work for ${services[si].name}`,
          charge,
          discountAmount: discount,
          finalAmount: Math.max(charge - discount, 0),
          processed,
          status,
          completed,
          delivered,
          createdById: staffIdx === 0 ? admin.id : staff[staffIdx - 1]?.id ?? admin.id,
        },
      })
    );
  }
  console.log(`Works: ${works.length}`);

  await Prisma.ackCounter.create({
    data: { year, lastSeq: works.length },
  });

  // ---------------------------------------------------------------
  // 6. PAYMENTS — one initial payment row per work
  // ---------------------------------------------------------------
  // [workIdx, paid, method]
  const paymentsPlan = [
    [0, 500, 'CASH'],
    [1, 300, 'ONLINE'],
    [2, 0, 'CASH'],
    [3, 0, 'CASH'],
    [4, 400, 'CHEQUE'],
    [5, 500, 'LOAN'],
    [6, 0, 'CASH'],
    [7, 1000, 'ONLINE'],
    [8, 300, 'CASH'],
    [9, 0, 'CASH'],
    [10, 200, 'ONLINE'],
    [11, 350, 'CASH'],
  ];

  const deriveStatus = (finalAmount, paid) => {
    if (paid <= 0) return 'PENDING';
    if (paid >= finalAmount) return 'COMPLETED';
    return 'BALANCE';
  };

  for (let i = 0; i < paymentsPlan.length; i++) {
    const [wi, paid, method] = paymentsPlan[i];
    const work = works[wi];
    const finalAmount = work.finalAmount;
    const remaining = Math.max(finalAmount - paid, 0);
    await Prisma.payment.create({
      data: {
        workId: work.id,
        paid,
        remaining,
        paymentMethod: method,
        paymentStatus: deriveStatus(finalAmount, paid),
        receiptNumber: `RCPT-${year}-${String(i + 1).padStart(4, '0')}`,
        createdById: work.createdById,
      },
    });
  }
  console.log(`Payments: ${paymentsPlan.length}`);

  // ---------------------------------------------------------------
  // 7. ACTIVITY LOGS
  // ---------------------------------------------------------------
  await Prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: 'STAFF_CREATED', entityType: 'STAFF', entityId: staff[0].id, details: `Staff ${staff[0].name} was created` },
      { userId: admin.id, action: 'STAFF_CREATED', entityType: 'STAFF', entityId: staff[1].id, details: `Staff ${staff[1].name} was created` },
      { userId: staff[0].id, action: 'LOGIN_SUCCESS', entityType: 'AUTH', entityId: staff[0].id, details: 'Staff logged in successfully' },
      { userId: staff[0].id, action: 'WORK_CREATED', entityType: 'WORKS', entityId: works[0].id, details: `Work ${works[0].acknowledgementNumber} created` },
      { userId: staff[1].id, action: 'PAYMENT_CREATED', entityType: 'PAYMENT', entityId: works[1].id, details: `Payment collected for ${works[1].acknowledgementNumber}` },
      { userId: admin.id, action: 'BACKUP_CREATED', entityType: 'BACKUP', entityId: 1, details: 'Manual backup taken' },
    ],
  });

  // ---------------------------------------------------------------
  // 8. LOGIN SESSIONS
  // ---------------------------------------------------------------
  await Prisma.loginSession.createMany({
    data: [
      { userId: admin.id, loginAt: daysAgo(1), logoutAt: daysAgo(1), deviceInfo: 'Admin Desktop - Chrome', isActive: false },
      { userId: staff[0].id, loginAt: daysAgo(0), logoutAt: null, deviceInfo: 'Counter PC 1 - Chrome', isActive: true },
      { userId: staff[1].id, loginAt: daysAgo(2), logoutAt: daysAgo(1), deviceInfo: 'Counter PC 2 - Firefox', isActive: false },
    ],
  });

  // ---------------------------------------------------------------
  // 9. BACKUP LOGS
  // ---------------------------------------------------------------
  await Prisma.backupLog.create({
    data: {
      userId: admin.id,
      backupFileName: `backup-${year}-01-15.db`,
      filePath: `/backups/backup-${year}-01-15.db`,
      fileSize: 204800,
      backupDate: daysAgo(10),
      notes: 'Weekly manual backup',
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await Prisma.$disconnect();
  });
