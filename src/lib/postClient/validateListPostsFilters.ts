import Maybe from "../../types/general/maybe"
import ListPostsFilters from "../../types/postClient/listPostsFilters"
import validateListPostsFiltersField from "./validateListPostsFiltersField"

export default function validateListPostsFilters(
  filters: Maybe<ListPostsFilters> | undefined
) {
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
