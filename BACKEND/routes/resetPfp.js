var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, setDoc, doc, query, where } = require('firebase/firestore');
const db = getFirestore(app);

router.post('/', async (req, res, next) => {
    const { username, email, pfp } = req.body;

    // Validate input
    if (!username || !email || !pfp) {
        return res.status(400).json({ message: "Username, email, and pfp are required." });
    }

    try {
        const usersRef = collection(db, 'users');

        // Create an AND query
        const q = query(
            usersRef,
            where('username', '==', username),
            where('email', '==', email)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docRef = doc(usersRef, snapshot.docs[0].id);
            await setDoc(docRef, { pfp: pfp }, { merge: true });
            res.status(200).json({ message: "Profile picture updated successfully." });
        } else {
            res.status(404).json({ message: "User not found!" });
        }
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Error saving profile picture.' });
    }
});

module.exports = router;