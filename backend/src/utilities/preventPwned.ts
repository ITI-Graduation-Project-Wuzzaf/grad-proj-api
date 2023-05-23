import crypto from 'crypto';

export const isPwned = async (value: string): Promise<boolean> => {
  const hashedPassword = crypto.createHash('sha1').update(value).digest('hex').toUpperCase();
  const prefix = hashedPassword.slice(0, 5);
  const suffix = hashedPassword.slice(5);
  const url = `https://api.pwnedpasswords.com/range/${prefix}`;
  const res = await fetch(url);
  const data = await res.text();
  const breachedPasswords = data.split('\r\n');
  const matchingPassword = breachedPasswords.find((p) => p.includes(suffix));
  if (matchingPassword) {
    return true;
  }
  return false;
};
