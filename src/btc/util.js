import bitcoin from "bitcoinjs-lib"
import bip39 from 'bip39'
import { BIP32Factory } from 'bip32'
import * as ecc from 'tiny-secp256k1'
import crypto from 'crypto'

const bip32 = BIP32Factory(ecc)

const mnemonicToAccount = (mnemonic, network, path) => {
  // Convert the mnemonic to a seed (uses BIP39)
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  // console.log("Seed:", seed.toString('hex'))

  // Create a root key (uses BIP32)
  const root = bip32.fromSeed(seed, network ?? bitcoin.networks.bitcoin)

  // Derive the first account's extended private key (uses BIP44)
  const account = root.derivePath(path ?? "m/44'/0'/0'")

  // console.log("Private Key (WIF):   ", account.toWIF())
  // console.log("Private Key (Base58):", account.toBase58())

  return account
}

const sha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest()
}

// const fromSeed = bip32.fromSeed

export {
  mnemonicToAccount,
  sha256,
  bip32
}