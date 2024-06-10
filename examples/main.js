import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import { generators } from '../src/btc'

// This example aims to generate a Bitcoin address using multiple methods and verify if they produce the same addresses.
const exampleForBitcoinAccount = () => {
  // Generate a mnemonic (uses BIP39)
  const mnemonic = bip39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  let i = 0
  for (const generateBitcoinAddress of generators) {
    const { address, account } = generateBitcoinAddress(mnemonic)
    console.log(`-------------#${i++} -----------------`)
    console.log(`Bitcoin Address: ${address}`)
    console.log(`🔑: ${account.toWIF()}`)
    // console.log(`- others: ${JSON.stringify(addresses, null, 2)}`)

    // Create a message to sign
    const message = 'Hello, Bitcoin!'
    const hash = bitcoin.crypto.sha256(Buffer.from(message))
    const signature = account.sign(hash)
    console.log("Signature:", signature.toString('hex'))

    // Verify the signature
    const isValid = account.verify(hash, signature)
    console.log("Signature valid:", isValid)
  }
}

const main = () => {
  exampleForBitcoinAccount()
}

main()

