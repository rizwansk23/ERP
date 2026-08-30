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