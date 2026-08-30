
/**
  * @swagger
  * /api/auth/{id}:
  *   get:
  *     summary: Get user by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The user ID
  *     responses:
  *       200:
  *         description: Successfully retrieved user
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/User'
  *       404:
  *         description: User not found
  */

 /**
  * @swagger
  * /api/auth:
  *   post:
  *     summary: Create a new user
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
 *         description: User created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */