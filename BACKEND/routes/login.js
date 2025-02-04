var express = require('express');
var router = express.Router();

const { app } = require('../config/firebase');
const { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where, serverTimestamp } = require('firebase/firestore'); // Import Firestore functions
const db = getFirestore(app);

var encryption = require('../functions/passwordEncrypt');
var createToken = require('../functions/token');
var {getCurrentDateString} = require('../functions/dateOps');


router.post('/', async(req, res, next) => { 
  const { usernameOrEmail, password } = req.body;
  try {
      const usersRef = collection(db, 'users');
      const q1 = query(
          usersRef,
          where('username', '==', usernameOrEmail),
      );

      const snapshot1 = await getDocs(q1);
      if(!snapshot1.empty) // if username's found
      {
          const userDoc = snapshot1.docs[0];
          const userData = userDoc.data();
          const userPassword = userData.password;
          if(await encryption.compare(password, userPassword)) 
          {
            const userUser = userData.username;
            const email = userData.email;
            const pfpField = userData.pfp;
            const learnedWords = userData.learnedWords;
            const timeSpent = userData.timeSpent;
            const coursesLearned = userData.coursesLearned;
            const streak = userData.streak;
            const lastInteracted = userData.lastInteracted;
            const token = await createToken(userUser.toString(), email, pfpField, learnedWords, timeSpent, coursesLearned, streak, lastInteracted);
            res.status(200).json({ 'token': token });
          }
          else {
            res.status(400).json({ message: 'Wrong password!'});
            console.log(usernameOrEmail + ' ' + password);
            console.log('Wrong password!');
          }
      } 
      else // if the user did not input username
      {
          const q2 = query( // generate query for searching email
            usersRef,
            where('email', '==', usernameOrEmail),
          )

          const snapshot2 = await getDocs(q2);
          if(!snapshot2.empty) // if email's found
          {
            const userDoc = snapshot2.docs[0];
            const userData = userDoc.data();
            const userPassword = userData.password;
            if(encryption.compare(password, userPassword)) {
              console.log(userData.timeSpent);
              const userUser = userData.username;
              const pfpField = userData.pfp;
              const email = userData.email;
              const learnedWords = userData.learnedWords;
              const timeSpent = userData.timeSpent;
              const coursesLearned = userData.coursesLearned;
              const streak = userData.streak;
              const token = await createToken(userUser.toString(), email, pfpField, learnedWords, timeSpent, coursesLearned, streak);
              res.status(200).json({ 'token': token });
            }
            else res.status(400).json({ message: 'Wrong password!'});
            console.log('Wrong password!');
          }
          else res.status(400).json({ message: 'Wrong password!'});
          console.log('Wrong password!');
      }
    } catch(error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user.' });
  }
});

module.exports = router;
