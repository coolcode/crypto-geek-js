import bitcoin from "bitcoinjs-lib"
import { mnemonicToAccount } from "../util"

const generateBitcoinAddress = (mnemonic) => {
  const network = bitcoin.networks.bitcoin
  const path = "m/44'/0'/0'/0/0"
  const account = mnemonicToAccount(mnemonic, network, path)

  const { address } = bitcoin.payments.p2pkh({
    pubkey: account.publicKey,
    network
  })

  return {
    address,
    account
  }
}

export {
  generateBitcoinAddress
}
