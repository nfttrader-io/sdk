/**
 * Represents a MultiSigWallet object that contains an array of multisig objects.
 * Each multisig object contains the networkId and multisigAddress properties.
 */
type MultiSigWallet = {
  multisig: Array<{
    networkId: string
    multisigAddress: string
  }>
}

export default MultiSigWallet
