/**
 * Represents a bitmap offered, which is a string composed of three digits where each digit can be 0, 1, or 2.
 * If update -> update validateListPostsFiltersField under Bitmap fields check -> check bitmap length
 */
type BitmapOffered = `${0 | 1}${0 | 1 | 2}${0 | 1 | 2}`

export { BitmapOffered }
