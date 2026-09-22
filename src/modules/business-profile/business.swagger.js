/**
 * @swagger
 * components:
 *   schemas:
 *     BusinessProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 */

 /**
  * @swagger
  * /api/business-profile/{id}:
  *   get:
  *     summary: Get business profile by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The business profile ID
 *     responses:
 *       200:
 *         description: Successfully retrieved business profile
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/BusinessProfile'
 *       404:
 *         description: Business profile not found
 */

 /**
  * @swagger
  * /api/business-profile:
  *   post:
  *     summary: Create a new business profile
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Business profile created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/BusinessProfile'
 *       400:
 *         description: Invalid input
 */