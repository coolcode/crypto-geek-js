import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import { generateBitcoinAddress as gen00 } from './btc00'
import { generateBitcoinAddress as gen01 } from './btc01'
import { generateBitcoinAddress as gen02 } from './btc00'
import { generateBitcoinAddress as gen03 } from './btc02'

// This test case is to generate a bitcoin address in multiple ways
const generateAddressForTest = () => {
  // Generate a mnemonic (uses BIP39)
  const mnemonic = bip39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  let i = 0
  for (const generateBitcoinAddress of [gen00, gen01, gen02, gen03]) {
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

export { generateAddressForTest }

