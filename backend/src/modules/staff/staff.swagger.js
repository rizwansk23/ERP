/**
 * @swagger
 * tags:
 *   - name: Staff Management
 *     description: Admin APIs for managing staff members also Staff APIs
 */

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Karan Yadav
 *                 description: Staff member's name
 *               userId:
 *                 type: string
 *                 example: STF-2808
 *                 description: Optional custom Staff ID. If omitted, it will be generated automatically.
 *               password:
 *                 type: string
 *                 example: karan
 *                 description: Optional custom password. If omitted, it will be generated automatically.
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Staff name is required or invalid input
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       409:
 *         description: Staff ID already exists
 */

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get all staff members
 *     tags: [Staff Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only ADMIN can access this endpoint
 */

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get a single staff member
 *     tags: [Staff Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Database ID of the staff member
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Staff fetched successfully
 *       400:
 *         description: Invalid staff ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       404:
 *         description: Staff not found
 */

/**
 * @swagger
 * /api/staff/{id}/credentials:
 *   get:
 *     summary: View staff login credentials
 *     tags: [Staff Management]
 *     description: Admin can view the Staff ID and password of a staff member.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Database ID of the staff member
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Staff credentials fetched successfully
 *       400:
 *         description: Invalid staff ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       404:
 *         description: Staff not found
 */

/**
 * @swagger
 * /api/staff/{id}:
 *   patch:
 *     summary: Update staff name or password
 *     tags: [Staff Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Database ID of the staff member
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Staff Name
 *               password:
 *                 type: string
 *                 example: newpassword
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       400:
 *         description: Invalid update data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       404:
 *         description: Staff not found
 */

/**
 * @swagger
 * /api/staff/{id}/status:
 *   patch:
 *     summary: Activate or deactivate staff
 *     tags: [Staff Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Database ID of the staff member
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Staff status updated successfully
 *       400:
 *         description: isActive must be true or false
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       404:
 *         description: Staff not found
 */

/**
 * @swagger
 * /api/staff/profile:
 *   get:
 *     summary: Get current staff profile
 *     description: Get the profile of the currently logged-in staff member
 *     tags: [Staff Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff profile fetched successfully
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: User account is inactive
 *       404:
 *         description: Staff profile not found
 */

/**
 * @swagger
 * /api/staff/change-Password:
 *   patch:
 *     summary: change staff password from staff side 
 *     description: Staff apna password change kar sakta hai esliye ye api hai
 *     tags: [Staff Management]
*     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -currentPassword
 *               -newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password of the logged-in staff member
 *                 example: oldPassword
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: New password for the staff member
 *                 example: newpassword123
 *              
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password or new password is missing or invalid
 *       401:
 *         description: Authentication required or current password is incorrect
 *       403:
 *         description: User account is inactive
 *       404:
 *         description: Staff not found
 */