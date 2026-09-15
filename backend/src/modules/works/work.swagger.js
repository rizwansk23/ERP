/**
 * @swagger
 * tags:
 *   - name: Works
 *     description: APIs for listing, viewing, updating and deleting works
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Work:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         Acknowledgement:
 *           type: string
 *         Name:
 *           type: string
 *         Service:
 *           type: string
 *         Status:
 *           type: string
 *           enum: [ACCEPT, PENDING, REJECT]
 *     WorkDetail:
 *       type: object
 *       properties:
 *         Customer_name:
 *           type: string
 *         Argument_number:
 *           type: string
 *         Reference:
 *           type: string
 *           nullable: true
 *         Service_name:
 *           type: string
 *         Assigned_date:
 *           type: string
 *         Deadline_date:
 *           type: string
 *           nullable: true
 *         Status:
 *           type: string
 *           enum: [ACCEPT, PENDING, REJECT]
 *         IsDeliverd:
 *           type: boolean
 *         IsCompleted:
 *           type: boolean
 */

/**
 * @swagger
 * /api/works:
 *   get:
 *     summary: Get all works
 *     tags: [Works]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of works per page (1-100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term, letters only, 3-30 characters
 *     responses:
 *       200:
 *         description: Successfully retrieved works
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     item:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Work'
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /api/works/{work_id}:
 *   get:
 *     summary: Get work by ID
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: work_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The work ID
 *     responses:
 *       200:
 *         description: Successfully retrieved work
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/WorkDetail'
 *       400:
 *         description: Invalid work ID
 *       404:
 *         description: Work not found
 */

/**
 * @swagger
 * /api/works/{work_id}:
 *   delete:
 *     summary: Soft delete a work by ID
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: work_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The work ID
 *     responses:
 *       200:
 *         description: Work deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/WorkDetail'
 *       400:
 *         description: Invalid work ID
 *       404:
 *         description: Work not found
 */

/**
 * @swagger
 * /api/works/{work_id}:
 *   patch:
 *     summary: Update work status
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: work_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The work ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPT, PENDING, REJECT]
  *               delivered:
  *                 type: boolean
  *               completed:
  *                 type: boolean
  *               reference:
  *                 type: string
  *                 description: Work reference (max 100 characters)
  *               customer_name:
  *                 type: string
  *                 description: Customer full name, split into name and surname on update (max 100 characters)
  *               deadline:
  *                 type: string
  *                 format: date-time
  *                 description: Work deadline as a valid date string
  *     responses:
  *       200:
  *         description: Work status updated successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 success:
  *                   type: boolean
  *                 data:
  *                   type: object
  *       400:
  *         description: Invalid status, work ID, or request body
  *       404:
  *         description: Work not found
 */