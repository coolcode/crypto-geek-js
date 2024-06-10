import { expect, test } from 'vitest'
import bip39 from 'bip39'
import { generators } from '../src/btc'
import { sha256 } from '../src/util'

test('Generates a Bitcoin address using multiple methods to verify if they match', () => {
  // Generate a mnemonic (uses BIP39)
  const mnemonic = bip39.generateMnemonic()
  const message = 'Hello, Bitcoin!'

  const [firstGen, ...otherGenMethods] = generators

  // Use the first generated address as the reference for validation.
  const { address: expectedAddress, account: expectedAccount } = firstGen(mnemonic)
  const messageHash = sha256(Buffer.from(message))
  const expectedSignature = expectedAccount.sign(messageHash)
  expect(expectedAccount.verify(messageHash, expectedSignature)).toBe(true)

  // To verify if other methods produce the same addresses.
  for (const generateAccount of otherGenMethods) {
    const { address, account } = generateAccount(mnemonic)
    const signature = account.sign(messageHash)
    const isValid = account.verify(messageHash, signature)

    expect(address).toBe(expectedAddress)
    expect(signature.toString("hex")).toBe(expectedSignature.toString("hex"))
    expect(isValid).toBe(true)
  }

})