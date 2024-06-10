# Crypto Geek JS

## Examples

### BTC HD Wallet

This example aims to generate a Bitcoin address using multiple methods and verify if they produce the same addresses.

```javascript
  const network = bitcoin.networks.bitcoin
  const path = "m/44'/0'/0'/0/0"
  const account = mnemonicToAccount(mnemonic, network, path)

  const { address } = bitcoin.payments.p2pkh({
    pubkey: account.publicKey,
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
