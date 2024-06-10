import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import { BitcoinWallet } from '~/btc'
import { gen00, gen01, gen02 } from '~/demo/address'

// This example aims to generate a Bitcoin address using multiple methods and verify if they produce the same addresses.
const exampleForBitcoinAddress = () => {
  // Generate a mnemonic (uses BIP39)
  const mnemonic = bip39.generateMnemonic()
  console.log("mnemonic:", mnemonic)
  const purpose = "44" // // BIP44 (44), segwit (49), Native segwit (84), Bitcoin taproot (86)
  const network = bitcoin.networks.bitcoin
  const wallet = new BitcoinWallet(mnemonic, purpose, network)
  const account = wallet.createAccount()

  let i = 0
  for (const generateAddress of [gen00, gen01, gen02]) {
    const address = generateAddress(account, network)
    console.log(`#${i++} Bitcoin Address: ${address}`)
  }
}

const main = () => {
  exampleForBitcoinAddress()
}

main()

