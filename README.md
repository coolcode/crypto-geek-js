# Crypto Geek JS

## Examples

### BTC HD Wallet

This example aims to generate a Bitcoin address using multiple methods and verify if they produce the same addresses.

```javascript

  const mnemonic = '...'
  const purpose = "86" //BIP44 (44), segwit (49), Native segwit (84), Bitcoin taproot (86)
  const network = bitcoin.networks.bitcoin
  const wallet = new BitcoinWallet(mnemonic, purpose, network)
  const account = wallet.createAccount() 
  const keyPair = bip32.fromPrivateKey(account.privateKey, Buffer.alloc(32), network)
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(keyPair.publicKey),
    network
  })
  
```

## Quickstart

To install dependencies:

```bash
bun i
```

To run an example:

```bash
bun run examples/taproot.example.ts
```

To run tests:

```bash
bun test
```

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
