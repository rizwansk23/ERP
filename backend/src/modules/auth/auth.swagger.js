/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication and session APIs
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - password
 *             properties:
 *               userId:
 *                 type: string
 *                 example: ADMIN001
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: User ID and password are required
 *       401:
 *         description: Invalid user ID or password
 *       403:
 *         description: User account is inactive
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Authentication required
 *       404:
 *         description: No active session found
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User account is inactive
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change current user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: admin123
 *               newPassword:
 *                 type: string
 *                 example: admin456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password input
 *       401:
 *         description: Authentication required
 */