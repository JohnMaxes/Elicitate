var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, setDoc, doc, query, where } = require('firebase/firestore');
const db = getFirestore(app);

router.post('/', async (req, res, next) => {
    const { username, email, learnedWordId } = req.body;

    // Validate input
    if (!username || !email) {
        return res.status(400).json({ message: "Username, email, and learnedWordId are required." });
    }
    console.log(username, email);
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
            const userDoc = snapshot.docs[0].data();

            // Get the current learnedWords value
            let learnedWords = userDoc.learnedWords || ""; // Default to an empty string if not set

            // Concatenate the new learnedWordId
            learnedWords = learnedWords ? `${learnedWords},${learnedWordId}` : learnedWordId;

            // Update the learnedWords field
            await setDoc(docRef, { learnedWords }, { merge: true });
            res.status(200).json({ message: learnedWords });
        } else {
            res.status(404).json({ message: "User not found!" });
            
        }
    } catch (error) {
        console.error('Error updating learned words:', error);
        res.status(500).json({ message: 'Error saving learned words.' });
    }
});

module.exports = router;