import { BIP32Interface } from "bip32"
import { Network } from "bitcoinjs-lib"

export interface HDWallet {
  mnemonic: string
  network: Network
  purpose: string // BIP44 (44), segwit (49), Native segwit (84), Bitcoin taproot (86)
  createAccount(): Account
}

export interface Account extends BIP32Interface {
  address: string
}