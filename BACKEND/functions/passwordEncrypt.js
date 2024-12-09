const bcrypt = require('bcrypt'); // built-in module for hashing

async function encryptPassword(data) {
    const saltRounds = 10; // number of times the data will be encrypted
    const salt = await bcrypt.genSalt(saltRounds); // generating "salt", a string that will be added to the password before encryption
    const hashedPassword = await bcrypt.hash(data, salt); // hash the password with the generated salt
    return hashedPassword;
}

module.exports = {
    encryptPassword: encryptPassword,
    compare: bcrypt.compare
};