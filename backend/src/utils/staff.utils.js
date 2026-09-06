export const generateStaffId = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `STF-${randomNumber}`;
};

export const generatePassword = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let password = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};