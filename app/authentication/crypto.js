const crypto = require("crypto");

const saltSize = 16;
const keySize = 64;
const ivSize = 16;
const tagSize = 16;
const scryptOptions = {
  N: 16384,
  r: 8,
  p: 1,
};
const secretKey = crypto.randomBytes(32);

const getSalt = async () => {
  return new Promise((fulfill, reject) => {
    crypto.randomBytes(saltSize, (err, salt) => {
      if (err) reject(err);
      else fulfill(salt);
    });
  });
};

const hashPassword = async (password, salt) => {
  return new Promise((fulfill, reject) => {
    crypto.scrypt(password, salt, keySize, scryptOptions, (err, key) => {
      if (err) reject(err);
      else fulfill(key);
    });
  });
};

const encrypt = async (content) => {
  let str = JSON.stringify(content);
  let iv = crypto.randomBytes(ivSize);
  let cipher = crypto.createCipheriv("aes-256-gcm", secretKey, iv);
  let encrypted = Buffer.concat([cipher.update(str, "utf8"), cipher.final()]);
  let tag = cipher.getAuthTag();
  
  console.log("Encrypting content:", content);
  console.log("IV:", iv.toString('hex'));
  console.log("Tag:", tag.toString('hex'));
  console.log("Encrypted data:", encrypted.toString('hex'));

  if (tag.length !== tagSize) throw new Error("Unexpected tag size");
  let buffer = Buffer.concat([iv, tag, encrypted]);
  return buffer.toString("base64");
};

const decrypt = async (token) => {
  try {
    let buffer = Buffer.from(token, "base64");
    let iv = buffer.slice(0, ivSize);
    let tag = buffer.slice(ivSize, ivSize + tagSize);
    let encrypted = buffer.slice(ivSize + tagSize);
    
    console.log("Decrypting token:", token);
    console.log("IV:", iv.toString('hex'));
    console.log("Tag:", tag.toString('hex'));
    console.log("Encrypted data:", encrypted.toString('hex'));
    console.log("Secret Key:", secretKey.toString('hex'));

    if (iv.length !== ivSize || tag.length !== tagSize) {
      console.error("Invalid IV or tag length");
      throw new Error("Invalid IV or tag length");
    }

    let decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, iv);
    decipher.setAuthTag(tag);
    let str = decipher.update(encrypted, "binary", "utf8") + decipher.final("utf8");
    return JSON.parse(str);
  } catch (e) {
    console.error("Error in decrypt:", e.message, e.stack);
    const error = new Error("Invalid authentication");
    error.statusCode = 400;
    throw error;
  }
};

const cryptoUtils = {
  saltSize: saltSize,
  keySize: keySize,
  ivSize: ivSize,
  tagSize: tagSize,
  scryptOptions: scryptOptions,
  secretKey: secretKey,
  getSalt: getSalt,
  hashPassword: hashPassword,
  encrypt: encrypt,
  decrypt: decrypt,
};

module.exports = cryptoUtils;
