import CryptoJS from 'crypto-js';

// Get encryption key from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not found in environment variables. Please set VITE_ENCRYPTION_KEY in your .env file.');
}

// Function to encrypt a value
export const encryptValue = (value) => {
    if (value === null || value === undefined) return value;
    
    try {
        const valueToEncrypt = value.toString();
        return CryptoJS.AES.encrypt(valueToEncrypt, ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
};

// Function to decrypt a value
export const decryptValue = (encryptedValue) => {
    if (!encryptedValue) return encryptedValue;
    
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
};

// Function to encrypt specific fields in an object
export const encryptFields = async (data, fieldsToEncrypt) => {
    const encryptedData = { ...data };
    
    for (const field of fieldsToEncrypt) {
        if (encryptedData[field] !== undefined) {
            encryptedData[field] = encryptValue(encryptedData[field]);
        }
    }
    
    return encryptedData;
};

// Function to decrypt specific fields in an object
export const decryptFields = async (data, fieldsToDecrypt) => {
    const decryptedData = { ...data };
    
    for (const field of fieldsToDecrypt) {
        if (decryptedData[field] !== undefined) {
            decryptedData[field] = decryptValue(decryptedData[field]);
        }
    }
    
    return decryptedData;
}; 