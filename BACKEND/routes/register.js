var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where, serverTimestamp } = require('firebase/firestore'); // Import Firestore functions
const db = getFirestore(app);

var encryptPassword = require('../functions/passwordEncrypt');

router.post('/', async (req, res, next) => {
    const { username, email, password } = req.query;
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            const hashedPassword = await encryptPassword(password);

            const docRef = doc(usersRef, email);
            const newDoc = await setDoc(docRef, {
                email: email,
                password: hashedPassword,
                username: username,
                createdAt: serverTimestamp()
            });
            res.status(201).json({ message: 'User registered successfully!' });
        } else {
            res.status(400).json({ message: 'Username already taken.' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
});

module.exports = router;