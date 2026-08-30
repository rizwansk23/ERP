/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

 /**
  * @swagger
  * /api/services/{id}:
  *   get:
  *     summary: Get service by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The service ID
 *     responses:
 *       200:
 *         description: Successfully retrieved service
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */

 /**
  * @swagger
  * /api/services:
  *   post:
  *     summary: Create a new service
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid input
 */