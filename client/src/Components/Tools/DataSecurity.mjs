import CryptoJS from 'crypto-js';

const encryptJSONToString = (jsonObject) => {

    let secretKey = "Kartik's Secret Key"
    const jsonString = JSON.stringify(jsonObject);
    const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
    return encrypted;
};


const decryptStringToJSON = (encryptedString) => {
    let secretKey = "Kartik's Secret Key"
    const decrypted = CryptoJS.AES.decrypt(encryptedString, secretKey).toString(CryptoJS.enc.Utf8);
    const decryptedJson = JSON.parse(decrypted);
    return decryptedJson;
};

let main=()=>
{
    let example={
        name:"Kartik"
    }
    let encrypt=encryptJSONToString(example)
    console.log(encrypt)
    let decrypt=decryptStringToJSON(encrypt)
    console.log(decrypt)
}

main();

export {encryptJSONToString,decryptStringToJSON}
