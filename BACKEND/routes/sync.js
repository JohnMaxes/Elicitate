var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, setDoc, doc, query, where } = require('firebase/firestore');
const db = getFirestore(app);

router.post('/', async (req, res, next) => {
    const { username, email, learnedWords, streak, lastInteracted, timeSpent } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: "Username, email, and learnedWords are required." });
    }
    console.log(username, email);
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('username', '==', username),
            where('email', '==', email)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docRef = doc(usersRef, snapshot.docs[0].id);
            await setDoc(docRef, [{ streak: streak }, { lastInteracted: lastInteracted }, 
                                  { learnedWords: learnedWords }, { timeSpent: timeSpent}], { merge: true });
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(404).json({ message: "User not found!" });
        }
    } catch (error) {
        console.error('Error updating learned words:', error);
        res.status(500).json({ message: 'Error saving learned words.' });
    }
});

module.exports = router;