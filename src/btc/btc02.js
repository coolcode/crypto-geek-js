import bitcoin from 'bitcoinjs-lib'
import { mnemonicToAccount } from "./util"

const generateBitcoinAddress = (mnemonic) => {
  const network = bitcoin.networks.bitcoin
  const path = "m/44'/0'/0'"
  const root = mnemonicToAccount(mnemonic, network, path)

  // Derive the first account address (uses BIP44)
  const account = root.derive(0).derive(0)
  const { address } = bitcoin.payments.p2pkh({
    pubkey: account.publicKey,
    network: bitcoin.networks.bitcoin,
  }) 

  let addresses = []
  let i = 0
  while (i++ < 10) {
    // Derive the sub account address (uses BIP44)
    const { publicKey } = account.derive(0).derive(i)
    const { address: addr } = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network: bitcoin.networks.bitcoin,
    })
    addresses.push({ address: addr, pubkey: publicKey.toString('hex') })
  }

  return { 
    address,
    addresses,
    account
  }
}

export {
  generateBitcoinAddress
}

