const express = require('express');
const { createContact, getAllContacts, deleteContact } = require('../controllers/Contact');

const router = express.Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a contact query
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: John Doe
 *               Email:
 *                 type: string
 *                 example: johndoe@example.com
 *               Phone:
 *                 type: string
 *                 example: +1234567890
 *               Query:
 *                 type: string
 *                 example: I have a question about your services.
 *     responses:
 *       200:
 *         description: Query submitted successfully
 *       500:
 *         description: Server error
 */
router.post('/', createContact);

// /**
//  * @swagger
//  * /contact:
//  *   get:
//  *     summary: Retrieve all contact queries
//  *     tags: [Contact]
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved
//  *       500:
//  *         description: Server error
//  */
// router.get('/', getAllContacts);

// /**
//  * @swagger
//  * /contact/{id}:
//  *   delete:
//  *     summary: Delete a contact query by ID
//  *     tags: [Contact]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the contact query to delete
//  *     responses:
//  *       200:
//  *         description: Query deleted successfully
//  *       404:
//  *         description: Query not found
//  *       500:
//  *         description: Server error
//  */
// router.delete('/:id', deleteContact);

module.exports = router;
