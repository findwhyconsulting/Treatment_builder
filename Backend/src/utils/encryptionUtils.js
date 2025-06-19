import crypto from "crypto";

const encryptionKey = crypto.randomBytes(32); // Store securely in env variables
const fixedIV = crypto.randomBytes(16); // Fixed IV for deterministic encryption

// Encryption functions
export const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Random IV for secure encryption
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { iv: iv.toString("hex"), encryptedData: encrypted };
};

export const decrypt = ({ iv, encryptedData }) => {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

// Deterministic encryption for searchable fields
export const deterministicEncrypt = (text) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, fixedIV);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted; // Fixed IV, so no need to store separately
};

// Hashing function
export const hashValue = (text) => crypto.createHash("sha256").update(text).digest("hex");


// // Symmetric encryption (AES-256-CBC)
// const ALGORITHM = "aes-256-cbc";
// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your32charlongencryptionkey"; // Store securely in .env
// const IV_LENGTH = 16; // 16 bytes IV length

// // Function to generate a deterministic hash for a string using SHA-256
// export const hash = (input) => {
//     return crypto.createHash('sha256').update(input).digest('hex');
//   };
  
// // Encrypt text
// export const encrypt = (text) => {
//   const iv = crypto.randomBytes(IV_LENGTH); // Generate random IV
//   const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return iv.toString("hex") + ":" + encrypted; // Return IV and encrypted text concatenated
// };

// // Decrypt text
// export const decrypt = (text) => {
//   const [ivHex, encryptedText] = text.split(":");
//   const iv = Buffer.from(ivHex, "hex");
//   const encryptedBuffer = Buffer.from(encryptedText, "hex");
//   const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
//   let decrypted = decipher.update(encryptedBuffer, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// };
