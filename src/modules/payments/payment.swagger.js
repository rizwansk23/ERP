/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Work payment history and collection
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentListItem:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         Acknowledgement:
 *           type: string
 *         Name:
 *           type: string
 *         Reference:
 *           type: string
 *           nullable: true
 *         Service:
 *           type: string
 *         Payment_status:
 *           type: string
 *           enum: [PENDING, BALANCE DUE, COMPLETED, FAILED,BAL]
 *           nullable: true
 *         Reminder:
 *           type: boolean
 *     PaymentDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/PaymentListItem'
 *         - type: object
 *           properties:
 *             Phone:
 *               type: string
 *             Discount_Amount:
 *               type: number
 *             Final_Amount:
 *               type: number
 *             Remaining:
 *               type: number
 *               nullable: true
 *             Total_Paid:
 *               type: number
 *             Payment_History:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Id:
 *                     type: integer
 *                   Payment_method:
 *                     type: string
 *                   Payment_status:
 *                     type: string
 *                   Paid:
 *                     type: number
 *                   Remaining:
 *                     type: number
 *                     nullable: true
 *                   Receipt_Number:
 *                     type: string
 *                     nullable: true
 *                   Created_At:
 *                     type: string
 *     CreatePaymentRequest:
 *       type: object
 *       required: [amount, paymentMethod]
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           example: 200
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, ONLINE, CHEQUE, LOAN]
 *           example: CASH
 *         createdById:
 *           type: number
 *           example: 1
 *           description: Optional client receipt ref. Auto-generated when omitted.
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         module:
 *           type: string
 *           example: PAYMENT
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     tags: [Payments]
 *     summary: List works with their latest payment status (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, BALANCE DUE, BALANCE, COMPLETED, FAILED] }
 *         description: Filter by payment status ('BALANCE' is accepted as an alias).
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Matches acknowledgement number, reference, or customer name.
 *     responses:
 *       200:
 *         description: Paginated payment overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/PaymentListItem' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @swagger
 * /api/payments/{work_id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get full payment detail and history for a work
 *     parameters:
 *       - in: path
 *         name: work_id
 *         required: true
 *         schema: { type: integer }
 *         description: The work ID
 *     responses:
 *       200:
 *         description: Payment detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/PaymentDetail' }
 *       400:
 *         description: Invalid work id
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: Work not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   post:
 *     tags: [Payments]
 *     summary: Record a payment against a work
 *     description: >
 *       The remaining balance is recomputed server-side inside a DB
 *       transaction. Any client-supplied balance is ignored, and payments
 *       exceeding the remaining balance are rejected.
 *     parameters:
 *       - in: path
 *         name: work_id
 *         required: true
 *         schema: { type: integer }
 *         description: The work ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreatePaymentRequest' }
 *     responses:
 *       201:
 *         description: Payment recorded
 *       400:
 *         description: Invalid input or amount exceeds remaining balance
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: Work not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: Work is already fully paid
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
