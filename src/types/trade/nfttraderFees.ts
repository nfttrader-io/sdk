/**
 * Represents the fees associated with trading NFTs, including both a flat fee and a percentage fee.
 */
type NFTTraderFees = {
  /**
   * @property {Array<{ fee: string }>} flatFee - An array of objects representing flat fees.
   */
  flatFee: Array<{ fee: string }>
  /**
   * @property {Array<{ basisPoints: number }>} percentageFee - An array of objects representing percentage fees.
   */
  percentageFee: Array<{ basisPoints: number }>
}

export { NFTTraderFees }
