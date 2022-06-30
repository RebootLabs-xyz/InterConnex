import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { Noise } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'

import { Bootstrap } from '@libp2p/bootstrap'

// Known peers addresses
const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
]

const node = await createLibp2p({
  transports: [
    new WebSockets()
  ],
  connectionEncryption: [
    new Noise()
  ],
  streamMuxers: [
    new Mplex()
  ],
  peerDiscovery: [
    new Bootstrap({
      list: bootstrapMultiaddrs // provide array of multiaddrs
    })
  ],
  connectionManager: {
    autoDial: true, // Auto connect to discovered peers (limited by ConnectionManager minConnections)
    // The `tag` property will be searched when creating the instance of your Peer Discovery service.
    // The associated object, will be passed to the service when it is instantiated.
  }
})

node.on('peer:discovery', (peer) => {
  console.log('Discovered %s', peer.id.toB58String()) // Log discovered peer
})

node.connectionManager.on('peer:connect', (connection) => {
  console.log('Connected to %s', connection.remotePeer.toB58String()) // Log connected peer
})

// start libp2p
await node.start()