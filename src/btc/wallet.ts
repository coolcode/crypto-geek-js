import { mnemonicToAccount } from "~/util"
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

    // proxy for bip32 account
    return new Proxy(account, {
      get(target, prop, receiver) {
        if (prop === 'address') {
          const { address } = payments.p2pkh({
            pubkey: account.publicKey,
            //  network: account.network 
          })
          return address
        }

        // If the property is a function, we wrap it to call the original function
        if (typeof target[prop]  === 'function') {
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