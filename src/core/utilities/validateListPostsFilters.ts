import { Maybe } from "../../types/base"
import { ListPostsFilters } from "../../interfaces/post/listpostsfilters"
import { validateListPostsFiltersField } from "./validatelistpostsfiltersfield"

/**
 * Validates the list of post filters to ensure they are in the correct format.
 * @param {Maybe<ListPostsFilters> | undefined} filters - The list of post filters to validate.
 * @throws {Error} If the filters parameter is invalid.
 * @returns None
 */
export function validateListPostsFilters(filters?: Maybe<ListPostsFilters>) {
  if (filters === null || filters === undefined) return
  if (
    filters.constructor !== new Object().constructor ||
    !Object.keys(filters).length
  )
    throw new Error('invalid parameter "filters"')

  for (const filter in filters)
    validateListPostsFiltersField(
      filter as keyof ListPostsFilters,
      filters[filter as keyof ListPostsFilters]
    )
}
