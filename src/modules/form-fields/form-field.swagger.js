/**
 * @swagger
 * components:
 *   schemas:
 *     FormField:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         types:
 *           type: string
 *         required:
 *           type: boolean
 */

 /**
  * @swagger
  * /api/form-fields/{id}:
  *   get:
  *     summary: Get form field by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The form field ID
 *     responses:
 *       200:
 *         description: Successfully retrieved form field
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/FormField'
 *       404:
 *         description: Form field not found
 */

 /**
  * @swagger
  * /api/form-fields:
  *   post:
  *     summary: Create a new form field
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 types:
 *                   type: string
 *                 required:
 *                   type: boolean
 *     responses:
 *       201:
 *         description: Form field created successfully
 *         content:
 *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/FormField'
 *       400:
 *         description: Invalid input
 */