const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Hasha ett lösenord vid registrering
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
}

async function comparePassword(password, hash) {
    const isTheSame = await bcrypt.compare(password, hash);
    console.log('Password correct: ', isTheSame);
    return isTheSame;
}

module.exports = {
    hashPassword,
    comparePassword
};