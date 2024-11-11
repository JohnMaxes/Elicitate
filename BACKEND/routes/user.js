var express = require('express');
var router = express.Router();
const { app } = require('../config/firebase');
const { getFirestore, doc, getDoc } = require('firebase/firestore'); // use Firestore to extract data
const db = getFirestore(app); // Initialize Firestore with the app

router.get('/:id', async function(req, res, next) {
    const userId = req.params.id;
    const userRef = doc(db, 'users', userId);

    try {
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            res.status(200).json(userDoc.data()); // Send the user data as JSON
        } else {
            res.status(404).json({ message: 'User not found' }); // Handle case where user does not exist
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});

module.exports = router;