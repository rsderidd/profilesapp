import CryptoJS from 'crypto-js';
import { KMSClient, GenerateDataKeyCommand } from '@aws-sdk/client-kms';
import { fetchAuthSession } from 'aws-amplify/auth';

// Initialize KMS client
let kmsClient = null;

async function getKMSClient() {
    if (!kmsClient) {
        const { credentials } = await fetchAuthSession();
        kmsClient = new KMSClient({
            region: 'ca-central-1',
            credentials
        });
    }
    return kmsClient;
}

// KMS key ID from your AWS account
const KEY_ID = 'arn:aws:kms:ca-central-1:183631345647:key/a3bde884-037f-4f9f-87f4-e41f3bf5e1c0';

// Get or generate data key from KMS
let dataKey = null;

async function getDataKey() {
    if (!dataKey) {
        try {
            const client = await getKMSClient();
            const command = new GenerateDataKeyCommand({
                KeyId: KEY_ID,
                KeySpec: 'AES_256'
            });

            const response = await client.send(command);
            
            // Store both the encrypted and plaintext versions
            dataKey = {
                plaintext: response.Plaintext,
                encrypted: response.CiphertextBlob
            };
        } catch (error) {
            console.error('Error generating data key:', error);
            throw error;
        }
    }
    return dataKey;
}

// Function to convert Uint8Array to a string that can be used as a key
function uint8ArrayToString(array) {
    return Array.from(new Uint8Array(array))
        .map(b => String.fromCharCode(b))
        .join('');
}

// Function to encrypt a value
export const encryptValue = async (value) => {
    if (value === null || value === undefined) return value;
    
    try {
        const key = await getDataKey();
        const valueToEncrypt = value.toString();
        
        // Convert the plaintext key to a string for use with CryptoJS
        const keyString = uint8ArrayToString(key.plaintext);
        
        // Encrypt the value using the data key
        const encrypted = CryptoJS.AES.encrypt(valueToEncrypt, keyString).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
};

// Function to decrypt a value
export const decryptValue = async (encryptedValue) => {
    if (!encryptedValue) return encryptedValue;
    
    try {
        const key = await getDataKey();
        
        // Convert the plaintext key to a string for use with CryptoJS
        const keyString = uint8ArrayToString(key.plaintext);
        
        // Decrypt the value using the data key
        const bytes = CryptoJS.AES.decrypt(encryptedValue, keyString);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        // Return the original value if decryption fails
        return encryptedValue;
    }
};

// Function to encrypt specific fields in an object
export const encryptFields = async (data, fieldsToEncrypt) => {
    const encryptedData = { ...data };
    
    for (const field of fieldsToEncrypt) {
        if (encryptedData[field] !== undefined) {
            encryptedData[field] = await encryptValue(encryptedData[field]);
        }
    }
    
    return encryptedData;
};

// Function to decrypt specific fields in an object
export const decryptFields = async (data, fieldsToDecrypt) => {
    const decryptedData = { ...data };
    
    for (const field of fieldsToDecrypt) {
        if (decryptedData[field] !== undefined) {
            decryptedData[field] = await decryptValue(decryptedData[field]);
        }
    }
    
    return decryptedData;
}; 