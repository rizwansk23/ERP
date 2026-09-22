/**
 * @swagger
 * tags:
 *   - name: Customer Intake
 *     description: Create and manage customer intake records (Customer + Work + initial Payment)
 */

// ============================================================================
// ACK NUMBER PREVIEW
// ============================================================================

/**
 * @swagger
 * /api/customer-intake/next-ack-number:
 *   get:
 *     summary: Preview the next acknowledgement number
 *     description: Returns the ACK number that will be assigned to the next intake. This is only a preview — the actual ACK returned on save is authoritative.
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next acknowledgement number fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Next acknowledgement number fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     acknowledgementNumber:
 *                       type: string
 *                       example: ACK-2026-12
 *       401:
 *         description: Authentication required
 */

// ============================================================================
// RECEIPT NUMBER PREVIEW
// ============================================================================

/**
 * @swagger
 * /api/customer-intake/next-receipt-number:
 *   get:
 *     summary: Preview the next receipt number
 *     description: Returns the receipt number that will be assigned to the next payment. This is only a preview — the actual receipt returned on save is authoritative.
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next receipt number fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Next receipt number fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     receiptNumber:
 *                       type: string
 *                       example: RCPT-2026-11
 *       401:
 *         description: Authentication required
 */

// ============================================================================
// CUSTOMER SUGGESTIONS
// ============================================================================

/**
 * @swagger
 * /api/customer-intake/customer-suggestions:
 *   get:
 *     summary: Suggest existing customers
 *     description: Returns up to 5 customers whose name, surname, or phone contains the query. Used for the intake form's type-ahead dropdown.
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: false
 *         description: Partial text to search for
 *         schema:
 *           type: string
 *           example: Akash
 *     responses:
 *       200:
 *         description: Customer suggestions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Customer suggestions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Akash
 *                       phone:
 *                         type: string
 *                         example: "9876543210"
 *       401:
 *         description: Authentication required
 */

// ============================================================================
// CREATE INTAKE
// ============================================================================

/**
 * @swagger
 * /api/customer-intake:
 *   post:
 *     summary: Create a new customer intake
 *     description: |
 *       Creates a Customer (or reuses an existing one), a Work, an optional initial Payment,
 *       and an ActivityLog entry — all inside a single transaction.
 *
 *       **Existing customer flow:**
 *       - If a Customer with the same `(name, surname)` exists and `confirmExistingCustomer` is not `true`,
 *         the API returns **409** with `code: "CUSTOMER_EXISTS"` and the existing customer's
 *         `{ id, name, surname, phone }`.
 *       - Re-send the same request with `confirmExistingCustomer: true` to proceed with the existing customer.
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - phone
 *               - charge
 *               - deadline
 *             properties:
 *               name:
 *                 type: string
 *                 example: Akash
 *               surname:
 *                 type: string
 *                 example: Sharma
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *                 description: Exactly 10 digits
 *               reference:
 *                 type: string
 *                 example: REF-001
 *               serviceId:
 *                 type: integer
 *                 example: 1
 *                 description: Provide either serviceId or customServiceName
 *               customServiceName:
 *                 type: string
 *                 example: screen repair
 *                 description: Uppercased on save; creates a new inactive service if not found
 *               charge:
 *                 type: number
 *                 example: 2200
 *               discount:
 *                 type: number
 *                 example: 200
 *               advance:
 *                 type: number
 *                 example: 500
 *               paymentMode:
 *                 type: string
 *                 enum: [CASH, ONLINE, CHEQUE, LOAN]
 *                 example: CASH
 *                 description: Required when advance > 0
 *               deadline:
 *                 type: string
 *                 example: "+10d"
 *                 description: Either an ISO date (YYYY-MM-DD) or a preset (+10d, +30d, +2m, custom)
 *               remark:
 *                 type: string
 *                 example: Handle with care
 *               confirmExistingCustomer:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Customer intake created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Customer intake created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     workId:
 *                       type: integer
 *                       example: 42
 *                     customerId:
 *                       type: integer
 *                       example: 17
 *                     acknowledgementNumber:
 *                       type: string
 *                       example: ACK-2026-12
 *                     receiptNumber:
 *                       type: string
 *                       nullable: true
 *                       example: RCPT-2026-11
 *                     paymentId:
 *                       type: integer
 *                       nullable: true
 *                       example: 33
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Service not found
 *       409:
 *         description: Customer already exists (needs confirmExistingCustomer = true)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 module:
 *                   type: string
 *                   example: CUSTOMER
 *                 error:
 *                   type: string
 *                   example: Customer already exists
 *                 code:
 *                   type: string
 *                   example: CUSTOMER_EXISTS
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: Akash
 *                     surname:
 *                       type: string
 *                       example: Sharma
 *                     phone:
 *                       type: string
 *                       example: "9876543210"
 */

// ============================================================================
// LIST INTAKES
// ============================================================================

/**
 * @swagger
 * /api/customer-intake:
 *   get:
 *     summary: List customer intakes
 *     description: Paginated list of intake records, sorted newest first. Search matches acknowledgement number, reference, customer name, surname, or phone.
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *           example: Akash
 *     responses:
 *       200:
 *         description: Customer intakes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Customer intakes fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 42
 *                       acknowledgementNumber:
 *                         type: string
 *                         example: ACK-2026-12
 *                       reference:
 *                         type: string
 *                         nullable: true
 *                         example: REF-001
 *                       name:
 *                         type: string
 *                         example: Akash
 *                       surname:
 *                         type: string
 *                         example: Sharma
 *                       phone:
 *                         type: string
 *                         example: "9876543210"
 *                       serviceName:
 *                         type: string
 *                         example: SCREEN REPAIR
 *                       workDate:
 *                         type: string
 *                         format: date-time
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                       charge:
 *                         type: number
 *                         example: 2200
 *                       discount:
 *                         type: number
 *                         example: 200
 *                       finalAmount:
 *                         type: number
 *                         example: 2000
 *                       paid:
 *                         type: number
 *                         example: 500
 *                       remaining:
 *                         type: number
 *                         example: 1500
 *                       paymentMethod:
 *                         type: string
 *                         nullable: true
 *                         example: CASH
 *                       paymentStatus:
 *                         type: string
 *                         example: BALANCE
 *                       status:
 *                         type: string
 *                         example: PENDING
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 87
 *                     totalPages:
 *                       type: integer
 *                       example: 9
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 */

// ============================================================================
// GET ONE INTAKE
// ============================================================================

/**
 * @swagger
 * /api/customer-intake/{id}:
 *   get:
 *     summary: Get a single customer intake
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Database ID of the Work
 *         schema:
 *           type: integer
 *           example: 42
 *     responses:
 *       200:
 *         description: Customer intake fetched successfully
 *       400:
 *         description: Invalid intake ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Intake not found
 */

// ============================================================================
// UPDATE INTAKE
// ============================================================================

/**
 * @swagger
 * /api/customer-intake/{id}:
 *   put:
 *     summary: Update an existing intake
 *     description: |
 *       Updates the existing Customer, Work, and initial Payment row in place.
 *       No new Customer or Work is created. The acknowledgement number is immutable.
 *       If `advance` was 0 at create and is set to > 0 here, the initial Payment row
 *       is created (with a receipt number allocated via the whole-transaction retry loop).
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 42
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               phone:
 *                 type: string
 *               reference:
 *                 type: string
 *               serviceId:
 *                 type: integer
 *               customServiceName:
 *                 type: string
 *               charge:
 *                 type: number
 *               discount:
 *                 type: number
 *               advance:
 *                 type: number
 *               paymentMode:
 *                 type: string
 *                 enum: [CASH, ONLINE, CHEQUE, LOAN]
 *               paymentStatus:
 *                 type: string
 *                 enum: [PENDING, BALANCE, COMPLETED]
 *               deadline:
 *                 type: string
 *               remark:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: Customer intake updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Intake not found
 */

// ============================================================================
// DELETE INTAKE
// ============================================================================

/**
 * @swagger
 * /api/customer-intake/{id}:
 *   delete:
 *     summary: Soft-delete a customer intake (Admin only)
 *     description: Soft-deletes only the Work row. The Customer and Payment rows remain intact.
 *     tags: [Customer Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 42
 *     responses:
 *       200:
 *         description: Customer intake deleted successfully
 *       400:
 *         description: Invalid intake ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       404:
 *         description: Intake not found
 */