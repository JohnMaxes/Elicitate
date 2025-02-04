var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, setDoc, doc, query, where, increment } = require('firebase/firestore');
const db = getFirestore(app);

router.post('/', async (req, res, next) => {
    const { username, email, timeSpent } = req.body;

    if (!username || !email || timeSpent === undefined) {
        console.log('Not all fields are filled out');
        return res.status(400).json({ message: "Username, email, and timeSpent are required." });
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
            await setDoc(docRef, { timeSpent: increment(timeSpent) }, { merge: true });
            res.status(200).json({ message: `Time spent updated successfully.` });
        } else {
            res.status(404).json({ message: "User not found!" });
        }
    } catch (error) {
        console.error('Error updating time spent:', error);
        res.status(500).json({ message: 'Error saving time spent.' });
    }
});

module.exports = router;