import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);
  } catch (err) {
    console.error('Error hashing password:', err.message);
  }
};

// Replace 'yourPasswordHere' with the actual password you want to hash
hashPassword('admin123');

