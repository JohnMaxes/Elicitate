var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where, serverTimestamp } = require('firebase/firestore');
const db = getFirestore(app);

var encryption = require('../functions/passwordEncrypt');
var createToken = require('../functions/token')


router.post('/', async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            const hashedPassword = await encryption.encryptPassword(password);

            const docRef = doc(usersRef, username);
            const newDoc = await setDoc(docRef, {
                email: email,
                password: hashedPassword,
                username: username,
                createdAt: serverTimestamp(),
                pfp: '',
            });
            const token = await createToken(username, email);
            res.status(201).json({ token: token });
        } else {
            res.status(409).json({ message: 'Username already taken.' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
});

module.exports = router;