/**
 * @swagger
 * components:
 *   schemas:
 *     Work:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 */

 /**
  * @swagger
  * /api/works/{id}:
  *   get:
  *     summary: Get work by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The work ID
 *     responses:
 *       200:
 *         description: Successfully retrieved work
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Work'
 *       404:
 *         description: Work not found
 */

 /**
  * @swagger
  * /api/works:
  *   post:
  *     summary: Create a new work
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Work created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Work'
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/works:
 *   get:
 *     summary: Get all works
 *     tags: [Works]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search by acknowledgement number, reference, customer name, service, or status
 *         example: Rohan
 *
 *       - in: query
 *         name: filter
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - ALL
 *             - COMPLETED
 *             - DELIVERED
 *             - PENDING
 *             - DEADLINE_EXCEEDED
 *             - ACCEPTED
 *             - REJECTED
 *           default: ALL
 *         description: Filter works by status
 *         example: PENDING
 *
 *     responses:
 *       200:
 *         description: Works fetched successfully
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
 *                   example: Works fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       acknowledgementNumber:
 *                         type: string
 *                         example: ACK-001
 *                       reference:
 *                         type: string
 *                         nullable: true
 *                         example: REF-1001
 *                       workDate:
 *                         type: string
 *                         format: date-time
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       status:
 *                         type: string
 *                         example: PENDING
 *                       processed:
 *                         type: boolean
 *                         example: false
 *                       completed:
 *                         type: boolean
 *                         example: false
 *                       delivered:
 *                         type: boolean
 *                         example: false
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Rohan
 *                           surname:
 *                             type: string
 *                             example: Mehta
 *                       service:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Birth Certificate
 *
 *       400:
 *         description: Invalid filter
 *
 *       401:
 *         description: Authentication token is required or invalid
 *
 *       500:
 *         description: Internal server error
 */

 /**
 * @swagger
 * /api/works/{id}:
 *   get:
 *     summary: Get one work by ID
 *     tags: [Works]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Work ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Work fetched successfully
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
 *                   example: Work fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     acknowledgementNumber:
 *                       type: string
 *                       example: ACK-001
 *                     reference:
 *                       type: string
 *                       nullable: true
 *                       example: REF-1001
 *                     workDate:
 *                       type: string
 *                       format: date-time
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     remark:
 *                       type: string
 *                       nullable: true
 *                       example: Urgent work
 *                     charge:
 *                       type: number
 *                       example: 1000
 *                     discountAmount:
 *                       type: number
 *                       example: 100
 *                     finalAmount:
 *                       type: number
 *                       example: 900
 *                     status:
 *                       type: string
 *                       example: PENDING
 *                     processed:
 *                       type: boolean
 *                       example: false
 *                     completed:
 *                       type: boolean
 *                       example: false
 *                     delivered:
 *                       type: boolean
 *                       example: false
 *                     customer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Rohan
 *                         surname:
 *                           type: string
 *                           example: Mehta
 *                         phone:
 *                           type: string
 *                           example: "9876543210"
 *                     service:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Birth Certificate
 *                         defaultCharge:
 *                           type: number
 *                           example: 500
 *
 *       400:
 *         description: Invalid work ID
 *
 *       401:
 *         description: Authentication required
 *
 *       404:
 *         description: Work not found
 *
 *       500:
 *         description: Internal server error
 */

 /**
 * @swagger
 * /api/works/{id}:
 *   put:
 *     summary: Update a work
 *     tags: [Works]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Work ID
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remark:
 *                 type: string
 *                 nullable: true
 *                 example: Documents verified
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - ACCEPTED
 *                   - REJECTED
 *                 example: ACCEPTED
 *               delivered:
 *                 type: boolean
 *                 example: false
 *               processed:
 *                 type: boolean
 *                 example: true
 *               completed:
 *                 type: boolean
 *                 example: false
 *
 *     responses:
 *       200:
 *         description: Work updated successfully
 *
 *       400:
 *         description: Invalid work ID or request data
 *
 *       401:
 *         description: Authentication token is required or invalid
 *
 *       404:
 *         description: Work not found
 *
 *       500:
 *         description: Internal server error
 */