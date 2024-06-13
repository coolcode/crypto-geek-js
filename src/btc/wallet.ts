import { mnemonicToAccount, toXOnly } from "~/util"
import { Account, HDWallet } from "~/types"
import { Network, payments } from "bitcoinjs-lib"

export class BitcoinWallet implements HDWallet {
  mnemonic: string
  network: Network
  purpose: string

  constructor(mnemonic: string, purpose: string, network: Network) {
    this.mnemonic = mnemonic
    this.purpose = purpose
    this.network = network
  }

  createAccount(derive = "/0/0"): Account {
    const path = `m/${this.purpose}'/0'/0'${derive}`
    // console.log("path:", path)
    const account = mnemonicToAccount(this.mnemonic, this.network, path)
    const getAddress = addressBuilders[this.purpose]
    if (!getAddress) {
      throw Error(`invalid purpose: ${this.purpose}`)
    }

    // proxy for bip32 account
    return new Proxy(account, {
      get(target, prop, receiver) {
        if (prop === 'address') {
          return getAddress(account.publicKey, account.network)
        }

        // If the property is a function, we wrap it to call the original function
        if (typeof target[prop] === 'function') {
          return function (...args: any[]) {
            // console.log(`Calling ${String(prop)} with arguments:`, args)
            const result = target[prop](...args)
            // console.log(`Result from ${String(prop)}:`, result)
            return result
          }
        }

        // For non-function properties, just return the original property
        return Reflect.get(target, prop, receiver)
      }
    }) as Account
  }
}

function p2pkhAddress(pubkey: Buffer, network: Network) {
  const { address } = payments.p2pkh({
    pubkey,
    network
  })
  return address
}

function p2shAddress(pubkey: Buffer, network: Network) {
  const p2pkh = payments.p2pkh({
    pubkey,
    network
  })
  const { address } = payments.p2sh({
    redeem: p2pkh,
    network
  })
  return address
}

function p2wpkhAddress(pubkey: Buffer, network: Network) {
  const { address } = payments.p2wpkh({
    pubkey,
    network
  })
  return address
}

function p2trAddress(pubkey: Buffer, network: Network) {
  const { address } = payments.p2tr({
    pubkey: toXOnly(pubkey),
    network
  })
  return address
}

export const addressBuilders = {
  "44": p2pkhAddress, // legacy
  "49": p2shAddress, // nested segwit
  "84": p2wpkhAddress, // native segwit
  "86": p2trAddress, // taproot
}

