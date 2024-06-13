import { mnemonicToSeedSync } from 'bip39'
import { BIP32API, BIP32Factory } from 'bip32'
import * as ecc from 'tiny-secp256k1'
import * as crypto from 'crypto'
import { Network } from 'bitcoinjs-lib'
import * as bitcoin from 'bitcoinjs-lib'
import ECPairFactory from 'ecpair'
import * as tinysecp from 'tiny-secp256k1'

bitcoin.initEccLib(tinysecp)

export const bip32:BIP32API = BIP32Factory(ecc)
export const ECPair = ECPairFactory(ecc)

export const mnemonicToAccount = (mnemonic: string, network: Network, path = "m/44'/0'/0'") => {
  // Convert the mnemonic to a seed (uses BIP39)
  const seed = mnemonicToSeedSync(mnemonic)
  // console.log("Seed:", seed.toString('hex'))

  // Create a root key (uses BIP32)
  const root = bip32.fromSeed(seed, network)

  // Derive the first account's extended private key (uses BIP44)
  const account = root.derivePath(path)

  // console.log("Private Key (WIF):   ", account.toWIF())
  // console.log("Private Key (Base58):", account.toBase58())

  return account
}

export const sha256 = (data: Buffer) => {
  return crypto.createHash('sha256').update(data).digest()
}

// export const fromSeed = bip32.fromSeed

// Function to convert public key to x-only format for Taproot
export function toXOnly(pubKey: Buffer): Buffer {
  return pubKey.subarray(1, 33)
}

export { bitcoin }