import { expect, test } from 'vitest'
import { sha256 } from '../src/util'
import bitcoin from 'bitcoinjs-lib'

test('SHA256', () => {
  const message = 'Hello, Bitcoin!'
  const messageHash1 = bitcoin.crypto.sha256(Buffer.from(message)).toString("hex")
  const messageHash2 = sha256(Buffer.from(message)).toString("hex")
  expect(messageHash1).toBe(messageHash2)
})