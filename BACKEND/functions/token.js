const jwt = require('jsonwebtoken');

async function createToken(username, email, pfpPackage, tokenLearnedWords, tokenTimeSpent, tokenCoursesLearned, tokenStreak, tokenLastInteracted)
{
    const newToken = jwt.sign(
        { //payload
            user: username,
            email: email,
            pfp: pfpPackage,
            learnedWords: tokenLearnedWords,
            timeSpent: tokenTimeSpent,
            coursesLearned: tokenCoursesLearned,
            streak: tokenStreak,
            lastInteracted: tokenLastInteracted
        },
        'elicitate', //secret key
        {

        }
    )
    console.log('New token: ' + newToken)
    return newToken;
}

module.exports = createToken;