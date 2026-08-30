/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         generatedAt:
 *           type: string
 *           format: date-time
 */

 /**
  * @swagger
  * /api/reports/{id}:
  *   get:
  *     summary: Get report by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The report ID
 *     responses:
 *       200:
 *         description: Successfully retrieved report
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report not found
 */

 /**
  * @swagger
  * /api/reports:
  *   post:
  *     summary: Create a new report
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
 *         description: Report created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Report'
 *       400:
 *         description: Invalid input
 */