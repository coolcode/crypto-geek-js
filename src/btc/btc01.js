import bitcoin from 'bitcoinjs-lib'
import { bip32, mnemonicToAccount } from '../util'

const generateBitcoinAddress = (mnemonic) => {
  const network = bitcoin.networks.bitcoin
  const path = "m/44'/0'/0'/0/0"
  const account = mnemonicToAccount(mnemonic, network, path)

  const keyPair = bip32.fromPrivateKey(account.privateKey, account.chainCode, network)
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network
  })

  return { address, account }
}

export {
  generateBitcoinAddress
}
