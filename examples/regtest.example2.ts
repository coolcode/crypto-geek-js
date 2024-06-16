import * as bip39 from 'bip39'
import { bitcoin, bip32, toXOnly, ECPair } from "~/util"
import axios from "axios"

function btcdClient() {
  const rpcUser = 'rpcuser'
  const rpcPassword = 'rpcpass'
  const rpcPort = 18334
  const rpcHost = '127.0.0.1'


  const client = axios.create({
    baseURL: `http://${rpcHost}:${rpcPort}`,
    auth: {
      username: rpcUser,
      password: rpcPassword
    }
  })

  client.interceptors.request.use(request => {
    console.debug('axios req:', JSON.stringify(request))
    // console.log('Request:', JSON.stringify(request, null, 2))
    return request
  })

  client.interceptors.response.use(response => {
    const { status, data } = response
    console.debug('axios res:', JSON.stringify({ status, data }))
    return response
  })

  return client
}

// This example aims to generate a Bitcoin address using multiple methods and verify if they produce the same addresses.
async function exampleForRegtest () {
  const mnemonic = 'test test test test test test test test test test test test'

  const network = bitcoin.networks.regtest // regtest network params
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const rootKey = bip32.fromSeed(seed)
  const path = `m/86'/0'/0'/0/0`
  const childNode = rootKey.derivePath(path)

  const { address: fromAddress } = bitcoin.payments.p2pkh({
    pubkey: childNode.publicKey,
    network
  })
  console.log("fromAddress:", fromAddress) // momm8rNpibqMMiKB99qLsKCnt6aykVYzPN

  const keyPair = ECPair.makeRandom({ network })
  const { address: toAddress } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
  console.log("toAddress:", toAddress) // random address

  // get blockchain info
  const info = await callRPC('getblockchaininfo', [])
  console.log("info:", info)

  // mine some bitcoin
  console.log("start:", 101)
  await callRPC('generatetoaddress', [101, fromAddress])
  console.log("mined:", 101)

  // list UTXOs
  const utxos = await callRPC('listunspent', [1, 9999999, [fromAddress]])
  if (utxos.length === 0) {
    throw new Error('No unspent outputs available')
  }

  const txb = new bitcoin.TransactionBuilder(network)
  txb.setVersion(1)

  // pick one UTXO
  const utxo = utxos[0]
  txb.addInput(utxo.txid, utxo.vout)

  // send 1 BTC 
  const sendAmount = 1 * 1e8 // 1 BTC in satoshis
  const changeAmount = Math.floor(utxo.amount * 1e8) - sendAmount - 1000 // assuming 1000 satoshis as fee
  txb.addOutput(toAddress, sendAmount)
  txb.addOutput(fromAddress, changeAmount) // sending the change back to the original address

  // sign tx
  txb.sign(0, keyPair)

  // build & broadcast
  const tx = txb.build()
  const txHex = tx.toHex()

  const txid = await callRPC('sendrawtransaction', [txHex])
  console.log('Transaction sent with txid:', txid)

  // const curlCommand = `curl --user ${rpcUser}:${rpcPassword} --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "sendrawtransaction", "params": ["${txHex}"] }' -H 'content-type: text/plain;' http://${rpcHost}:${rpcPort}/`
  // console.log('Run the following command to send the transaction:')
  // console.log(curlCommand)
  // const txid = await client.sendRawTransaction(txHex)
  // console.log('transaction sent with txid:', txid)
  console.log("done!")
}

const btcd = btcdClient()

async function callRPC(method: string, params: any[] = []) {
  const { data } = await btcd.post('', {
    jsonrpc: '1.0',
    // rpcversion: '1.0',
    id: 'axios',
    method,
    params,
  })
  return data.result
}


exampleForRegtest()