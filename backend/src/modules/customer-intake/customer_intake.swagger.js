/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 */

 /**
  * @swagger
  * /api/customers/{id}:
  *   get:
  *     summary: Get customer by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The customer ID
 *     responses:
 *       200:
 *         description: Successfully retrieved customer
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */

 /**
  * @swagger
  * /api/customers:
  *   post:
  *     summary: Create a new customer
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid input
 */