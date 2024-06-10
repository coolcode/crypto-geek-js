import { BIP32Interface } from "bip32"
// import { ec } from 'elliptic'
import * as bs58 from 'bs58'
import * as crypto from 'crypto'
import { bitcoin, bip32, sha256, toXOnly } from "~/util"


export const gen00 = (account: BIP32Interface, network: bitcoin.Network): string | undefined => {
  const { address } = bitcoin.payments.p2pkh({
    pubkey: account.publicKey,
    network
  })

  return address
}

export const gen01 = (account: BIP32Interface, network: bitcoin.Network): string | undefined => {
  const keyPair = bip32.fromPrivateKey(account.privateKey!, account.chainCode, network)
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network
  })

  return address
}

export const gen02 = (account: BIP32Interface, network: bitcoin.Network): string | undefined => {

  // Get the public key
  // const secp256k1 = new ec('secp256k1')
  // const publicKey = secp256k1.keyFromPrivate(account.privateKey).getPublic('hex') 
  // take the first 32 bytes
  // console.log("pub key:", publicKey)

  const keyPair = bip32.fromPrivateKey(account.privateKey!, account.chainCode, network)
  const publicKey = keyPair.publicKey.toString('hex')
  // console.log("pub key:", publicKey)

  // Generate the Bitcoin address
  const publicKeyBytes = Buffer.from(publicKey, 'hex')
  const hash = sha256(publicKeyBytes)
  const hash2 = crypto.createHash('ripemd160').update(hash).digest()
  const version = Buffer.from('00', 'hex') // Mainnet address
  const hashWithVersion = Buffer.concat([version, hash2])
  const checksum = sha256(hashWithVersion)
  const checksum2 = sha256(checksum)
  const addressBytes = Buffer.concat([hashWithVersion, checksum2.subarray(0, 4)])
  const address = bs58.encode(addressBytes)

  return address
}

export const getTaprootAddress = (privateKey: Buffer, network: bitcoin.Network): string | undefined => {
  const keyPair = bip32.fromPrivateKey(privateKey, Buffer.alloc(32), network)
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(keyPair.publicKey),
    network
  })

  return address
}
