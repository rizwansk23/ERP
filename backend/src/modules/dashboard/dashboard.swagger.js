/**
 * @swagger
 * components:
 *   schemas:
 *     Dashboard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 */

/**
 * @swagger
 * /api/dashboard/{id}:
 *   get:
 *     summary: Get dashboard by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The dashboard ID
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       404:
 *         description: Dashboard not found
 */

/**
 * @swagger
 * /api/dashboard:
 *   post:
 *     summary: Create a new dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dashboard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get main dashboard summary
 *     description: Returns total completed works, revenue earned, and pending payments for the selected period.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         description: Time period for dashboard data
 *         schema:
 *           type: string
 *           enum:
 *             - 1M
 *             - 3M
 *             - 6M
 *             - 12M
 *             - CURRENT_FY
 *             - LAST_FY
 *             - LAST_3_FY
 *           default: 1M
 *         example: 3M
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
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
 *                   example: Dashboard summary fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalWorksDone:
 *                       type: integer
 *                       example: 128
 *                     totalRevenueEarned:
 *                       type: number
 *                       example: 184600
 *                     pendingPayments:
 *                       type: number
 *                       example: 32400
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/works-by-service:
 *   get:
 *     summary: Get works by service
 *     description: Returns the number of works for each service for the selected period.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         description: Time period for works by service
 *         schema:
 *           type: string
 *           enum:
 *             - 1M
 *             - 3M
 *             - 6M
 *             - 12M
 *             - CURRENT_FY
 *             - LAST_FY
 *             - LAST_3_FY
 *           default: 1M
 *         example: 3M
 *     responses:
 *       200:
 *         description: Works by service fetched successfully
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
 *                   example: Works by service fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       serviceId:
 *                         type: integer
 *                         example: 1
 *                       serviceName:
 *                         type: string
 *                         example: Birth Certificate
 *                       totalWorks:
 *                         type: integer
 *                         example: 25
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/export:
 *   get:
 *     summary: Export main dashboard report
 *     description: Downloads the main dashboard report as PDF or Excel.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         description: Time period for the report
 *         schema:
 *           type: string
 *           enum:
 *             - 1M
 *             - 3M
 *             - 6M
 *             - 12M
 *             - CURRENT_FY
 *             - LAST_FY
 *             - LAST_3_FY
 *           default: 1M
 *         example: CURRENT_FY
 *       - in: query
 *         name: format
 *         required: false
 *         description: Report file format
 *         schema:
 *           type: string
 *           enum:
 *             - pdf
 *             - excel
 *           default: pdf
 *         example: pdf
 *     responses:
 *       200:
 *         description: Dashboard report downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid report format
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */