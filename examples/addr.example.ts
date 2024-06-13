import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import { BitcoinWallet, addressBuilders } from '~/btc'
import { gen00, gen01, gen02 } from '~/demo/address'
import { ECPair } from '../src/util'

// This example aims to generate a Bitcoin address using multiple methods and verify if they produce the same addresses.
const exampleForBitcoinAddress = () => {
  // Generate a mnemonic (uses BIP39)
  const mnemonic = bip39.generateMnemonic()
  console.log("mnemonic:", mnemonic)
  const network = bitcoin.networks.bitcoin

  // legacy wallet example
  {
    const wallet = new BitcoinWallet(mnemonic, "44", network)
    const account = wallet.createAccount()
    let i = 0
    for (const generateAddress of [gen00, gen01, gen02]) {
      const address = generateAddress(account, network)
      console.log(`#${i++} Legacy(P2PKH) Address: ${address}`)
    }
  }

  // legacy(44), segwit (49), native segwit (84), taproot (86)
  for (const addressType of ["44", "49", "84", "86"]) {
    const wallet = new BitcoinWallet(mnemonic, addressType, network)
    const account = wallet.createAccount()
    console.log(`type: ${addressType} address: ${account.address}`)
  }

  const wifKey = process.env.BTC_PRIVATE_KEY
  if (!wifKey) {
    return
  }

  const testnet = bitcoin.networks.testnet
  const keyPair = ECPair.fromWIF(wifKey, testnet)
  const pubkey = keyPair.publicKey
  for (const addressType of ["44", "49", "84", "86"]) {
    const address = addressBuilders[addressType](pubkey, testnet)
    console.log(`type: ${addressType} address: ${address}`)
  }
}

const main = () => {
  exampleForBitcoinAddress()
}

main()

