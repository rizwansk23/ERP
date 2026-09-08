/**
 * @swagger
 * tags:
 *   - name: Activity Log
 *     description: Activity log management APIs
 */

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Get all activity logs
 *     description: Get a paginated list of activity logs with optional search and filters.
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         required: false
 *         description: Search by staff name, action, or activity details
 *         schema:
 *           type: string
 *           example: karan
 *       - name: action
 *         in: query
 *         required: false
 *         description: Filter activity logs by action
 *         schema:
 *           type: string
 *           example: CREATE_STAFF
 *       - name: staffOnly
 *         in: query
 *         required: false
 *         description: Show only staff-related activities
 *         schema:
 *           type: boolean
 *           example: true
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: Activity logs fetched successfully
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Only ADMIN can access this endpoint
 */

/**
 * @swagger
 * /api/activity-logs/{id}:
 *   get:
 *     summary: Get a single activity log
 *     description: Get complete details of one activity log by database ID.
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Database ID of the activity log
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Activity log fetched successfully
 *       400:
 *         description: Invalid activity log ID
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       404:
 *         description: Activity log not found
 */

/**
 * @swagger
 * /api/activity-logs/user/{userId}:
 *   get:
 *     summary: Get activity logs by user
 *     description: Get activity logs created by a particular user.
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: Database ID of the user
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: User activity logs fetched successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Only ADMIN can access this endpoint
 */

/**
 * @swagger
 * /api/activity-logs/{id}:
 *   delete:
 *     summary: Delete an activity log
 *     description: Soft delete an activity log by setting deletedAt and deletedById.
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Database ID of the activity log
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Activity log deleted successfully
 *       400:
 *         description: Invalid activity log ID
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Only ADMIN can access this endpoint
 *       404:
 *         description: Activity log not found
 */