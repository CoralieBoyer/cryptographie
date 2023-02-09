import { useRef, useState } from 'react';
import sha256 from 'crypto-js/sha256';
import md5 from 'crypto-js/md5';
import sha3 from 'crypto-js/sha3';
import ripemd160 from 'crypto-js/ripemd160';
import aesjs from 'aes-js';
// import crypto from "crypto-browserify";
// import NodeRSA from 'node-rsa';

function App() {
  const [hash, setHash] = useState(true);
  const [fileHash, setFileHash] = useState("");
  const [textHash, setTextHash] = useState("");
  const [textEncrypted, setTextEncrypted] = useState("");
  const [textDecrypted, setTextDecrypted] = useState("");
  const [encryptMode, setEncryptMode] = useState("AES");
  const [hashMode, setHashMode] = useState("SHA256");

  const textHashRef = useRef(null);
  const textEncryptedRef = useRef(null);
  const textDecryptedRef = useRef(null);
  const keyRef = useRef();

  const handleFileChange = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = function () {
      const fileContents = reader.result;
      let hash;
      switch (hashMode) {
        case "SHA256":
          hash = sha256(fileContents).toString();
          break;
        case "MD5":
          hash = md5(fileContents).toString();
          break;
        case "Keccak-512":
          hash = sha3(fileContents).toString();
          break;
        case "RipeMD160":
          hash = ripemd160(fileContents).toString();
          break;
        default:
          hash = sha256(fileContents).toString();
          break;
      }
      setFileHash(hash);
    };
    reader.readAsText(file);

  };

  const handleTextChange = () => {
    const text = textHashRef.current.value;
    let hash;
    switch (hashMode) {
      case "SHA256":
        hash = sha256(text).toString();
        break;
      case "MD5":
        hash = md5(text).toString();
        break;
      case "Keccak-512":
        hash = sha3(text).toString();
        break;
      case "RipeMD160":
        hash = ripemd160(text).toString();
        break;
      default:
        hash = sha256(text).toString();
        break;
    }
    setTextHash(hash);
  };

  const handleTextEncrypt = () => {
    if (encryptMode === "RSA") {
      const text = textEncryptedRef.current.value;
      const textBytes = aesjs.utils.utf8.toBytes(text);
      const key = aesjs.utils.utf8.toBytes(keyRef.current.value);
      const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      const encryptedBytes = aesCtr.encrypt(textBytes);
      const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      setTextEncrypted(encryptedHex);
    } else {

    }
  };

  const handleTextDecrypt = () => {
    const text = textDecryptedRef.current.value;
    const encryptedBytes = aesjs.utils.hex.toBytes(text);
    const key = aesjs.utils.utf8.toBytes(keyRef.current.value);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    setTextDecrypted(decryptedText);
  };


  return (
    <div>
      <div className="btn-group grid grid-cols-2">
        <button onClick={() => { setHash(true) }} className="btn btn-outline">Hash</button>
        <button onClick={() => { setHash(false) }} className="btn btn-outline">Encrypt</button>
      </div>
      {/* Hash */}
      {hash ?
        <div className='flex flex-col items-center w-full pt-24 justify-center'>
          <select onChange={(e) => setHashMode(e.target.value)} className='border'>
            <option value="SHA256">SHA256</option>
            <option value="MD5">MD5</option>
            <option value="Keccak-512">Keccak-512</option>
            <option value="RipeMD160">RipeMD160</option>
          </select>
          <div className='w-1/2'>
            <input onChange={handleFileChange} type="file" />
            <p>File Hash: {fileHash}</p>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' onClick={() => setFileHash("")}>Clear</button>
          </div>

          <div className='w-1/2 pt-8'>
            <input ref={textHashRef} type="text" className='border' placeholder='Enter text to hash' />
            <p>Text Hash: {textHash}</p>
            <button onClick={handleTextChange} className='mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'>Hash</button>
            <button onClick={() => { setTextHash("") }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'>Clear</button>
          </div>
        </div>
        :
        <div className='flex flex-col items-center w-full pt-24 justify-center'>
          <select onChange={(e) => setEncryptMode(e.target.value)} className='border'>
            <option value="AES">AES</option>
            <option value="RSA">RSA</option>
          </select>
          <input ref={keyRef} type="text" className='border' placeholder='Enter public key' />
          <div className='pt-8'>
            <input ref={textEncryptedRef} type="text" className='border' placeholder='Enter text to encrypt' />
            <p>Text Encrypted: {textEncrypted}</p>
            <button onClick={handleTextEncrypt} className='mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'>Encrypt</button>
          </div>
          <div className='pt-8'>
            <input ref={textDecryptedRef} type="text" className='border' placeholder='Enter text to decrypt' />
            <p>Text Decrypted: {textDecrypted}</p>
            <button onClick={handleTextDecrypt} className='mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'>Decrypt</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
