var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, setDoc, doc, query, where } = require('firebase/firestore');
const db = getFirestore(app);

router.post('/', async (req, res, next) => {
    const { username, email, newUsername, newEmail } = req.body;

    // Validate input
    console.log('Cred edit request received: ' + newUsername + ' ' + newEmail);
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

            if (newUsername !== '') await setDoc(docRef, { username: newUsername }, { merge: true });
            if (newEmail !== '') await setDoc(docRef, { email: newEmail }, { merge: true });
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(404).json({ message: "User not found!" });
            
        }
    } catch (error) {
        console.error('Error updating username and/or email:', error);
        res.status(500).json({ message: 'Error updating username and/or email' });
    }
});

module.exports = router;