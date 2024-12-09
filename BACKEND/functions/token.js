const jwt = require('jsonwebtoken');

async function createToken(username, email)
{
    const newToken = jwt.sign(
        { //payload
            user: username,
            email: email,
        },
        'elicitate', //secret key
        {

        }
    )
    return newToken;
}

module.exports = createToken;