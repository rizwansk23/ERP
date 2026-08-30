/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 */

 /**
  * @swagger
  * /api/staff/{id}:
  *   get:
  *     summary: Get staff by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The staff ID
  *     responses:
  *       200:
  *         description: Successfully retrieved staff
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Staff not found
 */

 /**
  * @swagger
  * /api/staff:
  *   post:
  *     summary: Create a new staff
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
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Staff created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Invalid input
 */