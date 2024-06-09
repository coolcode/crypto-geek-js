import { ec } from 'elliptic'
import bs58 from 'bs58'
import crypto from 'crypto'
import bitcoin from 'bitcoinjs-lib'
import { bip32, mnemonicToAccount, sha256 } from './util'

const generateBitcoinAddress = (mnemonic) => {

  const network = bitcoin.networks.bitcoin
  const path = "m/44'/0'/0'/0/0"

  // Step 1: Get the private key
  const account = mnemonicToAccount(mnemonic, network, path)
  const privateKey = account.privateKey

  // Step 2: Get the public key
  const secp256k1 = new ec('secp256k1')
  const publicKey = secp256k1.keyFromPrivate(privateKey).getPublic('hex')

  // console.log("pub key:", publicKey)

  // Step 3: Generate the Bitcoin address
  const publicKeyBytes = Buffer.from(publicKey, 'hex')
  const hash = sha256(publicKeyBytes)
  const hash2 = crypto.createHash('ripemd160').update(hash).digest()
  const version = Buffer.from('00', 'hex') // Mainnet address
  const hashWithVersion = Buffer.concat([version, hash2])
  const checksum = sha256(hashWithVersion)
  const checksum2 = sha256(checksum)
  const addressBytes = Buffer.concat([hashWithVersion, checksum2.subarray(0, 4)])
  const address = bs58.encode(addressBytes)

  return { address, account }
}

export {
  generateBitcoinAddress
}
