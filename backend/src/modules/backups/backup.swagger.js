/**
 * @swagger
 * components:
 *   schemas:
 *     Backup:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         filename:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

 /**
  * @swagger
  * /api/backups/{id}:
  *   get:
  *     summary: Get backup by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The backup ID
 *     responses:
 *       200:
 *         description: Successfully retrieved backup
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Backup'
 *       404:
 *         description: Backup not found
 */

 /**
  * @swagger
  * /api/backups:
  *   post:
  *     summary: Create a new backup
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *     responses:
 *       201:
 *         description: Backup created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Backup'
 *       400:
 *         description: Invalid input
 */