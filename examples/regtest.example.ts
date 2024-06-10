import * as bip39 from 'bip39'
import { bitcoin, bip32, toXOnly } from "~/util"
import { RegtestUtils } from 'regtest-client'


// This example aims to generate a Bitcoin address using multiple methods and verify if they produce the same addresses.
const exampleForRegtest = async () => {
  const mnemonic = 'hello abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon'

  const APIPASS = process.env.APIPASS || 'satoshi'
  const APIURL = process.env.APIURL || 'https://regtest.bitbank.cc/1'
  const regtestUtils = new RegtestUtils({ APIPASS, APIURL })

  const network = regtestUtils.network // regtest network params
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const rootKey = bip32.fromSeed(seed)
  const path = `m/86'/0'/0'/0/0`
  const childNode = rootKey.derivePath(path)
  // Since internalKey is an xOnly pubkey, we drop the DER header byte
  const internalPubkey = toXOnly(childNode.publicKey)
  const { address, output } = bitcoin.payments.p2tr({
    internalPubkey,
    network
  })

  console.log("address:", address)
  const tweakedChildNode = childNode.tweak(
    bitcoin.crypto.taggedHash('TapTweak', internalPubkey),
  )


  // Tell the server to send you coins (satoshis)
  // Can pass address
  // const unspent = await regtestUtils.faucet(address, 2e4)

  // amount from faucet
  const amount = 42e4
  // amount to send
  const sendAmount = amount - 1e4
  // Tell the server to send you coins (satoshis)
  // Can pass Buffer of the scriptPubkey (in case address can not be parsed by bitcoinjs-lib)
  // Non-standard outputs will be rejected, though.
  const { txId: hash, vout: index } = await regtestUtils.faucetComplex(output!, amount)
  console.log("hash:", hash)
  console.log("link:", `${APIURL}/t/${hash}/json`) 

  // Sent 420000 sats to taproot address
  const psbt = new bitcoin.Psbt({ network })
    .addInput({
      hash,
      index,
      witnessUtxo: { value: amount, script: output },
      tapInternalKey: internalPubkey,
    })
    .addOutput({
      value: sendAmount,
      address: regtestUtils.RANDOM_ADDRESS,
    })
    .signInput(0, tweakedChildNode)
    .finalizeAllInputs()

  const tx = psbt.extractTransaction()
  await regtestUtils.broadcast(tx.toHex())
  await regtestUtils.verify({
    txId: tx.getId(),
    address: regtestUtils.RANDOM_ADDRESS,
    vout: 0,
    value: sendAmount,
  })

  console.log(tx.toHex())
  console.log("done!")
}

exampleForRegtest()