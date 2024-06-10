import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import { BitcoinWallet } from '~/btc'

const exampleForBitcoinAccount = () => {
  // Generate a mnemonic (uses BIP39)
  const mnemonic = bip39.generateMnemonic()
  console.log("mnemonic:", mnemonic)
  const purpose = "86" // // BIP44 (44), segwit (49), Native segwit (84), Bitcoin taproot (86)
  const network = bitcoin.networks.bitcoin
  const wallets = [new BitcoinWallet(mnemonic, purpose, network)]

  let i = 0
  for (const wallet of wallets) {
    const account = wallet.createAccount()
    console.log(`-------------#${i++} -----------------`)
    console.log(`Bitcoin Address: ${account.address}`)
    console.log(`🔑: ${account.toWIF()}`)
    // console.log(`- others: ${JSON.stringify(addresses, null, 2)}`)

    // Create a message to sign
    const message = 'Hello, Bitcoin!'
    const messageHash = bitcoin.crypto.sha256(Buffer.from(message))
    const signature = account.sign(messageHash)
    console.log("Signature:", signature.toString('hex'))

    // Verify the signature
    const isValid = account.verify(messageHash, signature)
    console.log("Signature valid:", isValid)
  }
}

const main = () => {
  exampleForBitcoinAccount()
}

main()

