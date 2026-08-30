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