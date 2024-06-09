# Crypto Geek JS

## BTC HD Wallet

```javascript
  const network = bitcoin.networks.bitcoin
  const path = "m/44'/0'/0'/0/0"
  const account = mnemonicToAccount(mnemonic, network, path)

  const { address } = bitcoin.payments.p2pkh({
    pubkey: account.publicKey,
    network
  })
```

To install dependencies:

```bash
bun i
```

To run:

```bash
bun dev
```

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
