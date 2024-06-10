import { expect, test } from 'vitest'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import { sha256 } from '~/util'
import { BitcoinWallet } from '~/btc'
import { gen00, gen01, gen02, getTaprootAddress } from '~/demo/address'

test('Sign a message', () => {
  const mnemonic = bip39.generateMnemonic()
  const purpose = "44"
  const network = bitcoin.networks.bitcoin
  const wallet = new BitcoinWallet(mnemonic, purpose, network)
  const account = wallet.createAccount()

  const message = 'Hello, Bitcoin!'
  const messageHash = sha256(Buffer.from(message))
  const signature = account.sign(messageHash)
  expect(account.verify(messageHash, signature)).toBe(true)
})

test('Generates a Bitcoin address using multiple methods to verify if they match', () => {
  const mnemonic = bip39.generateMnemonic()
  const purpose = "44"
  const network = bitcoin.networks.bitcoin
  const wallet = new BitcoinWallet(mnemonic, purpose, network)
  const account = wallet.createAccount()
  const { address: expectedAddress } = bitcoin.payments.p2pkh({ pubkey: account.publicKey })

  for (const generateAddress of [gen00, gen01, gen02]) {
    const address = generateAddress(account, network)
    expect(address).toBe(expectedAddress)
  }
})

test('Taproot address', () => {
  // https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/taproot.spec.ts#L19
  const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
  const purpose = "86"
  const network = bitcoin.networks.bitcoin
  const wallet = new BitcoinWallet(mnemonic, purpose, network)
  const account = wallet.createAccount()
  const expectedAddress = 'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr'
  const address = getTaprootAddress(account.privateKey, network)
  expect(address).toBe(expectedAddress)
})