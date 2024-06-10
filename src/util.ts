import { mnemonicToSeedSync } from 'bip39'
import { BIP32Factory } from 'bip32'
import * as ecc from 'tiny-secp256k1'
import * as crypto from 'crypto'
import { Network } from 'bitcoinjs-lib'

const bip32 = BIP32Factory(ecc)

const mnemonicToAccount = (mnemonic: string, network: Network, path = "m/44'/0'/0'") => {
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

const sha256 = (data: Buffer) => {
  return crypto.createHash('sha256').update(data).digest()
}

// const fromSeed = bip32.fromSeed

export {
  mnemonicToAccount,
  sha256,
  bip32
}