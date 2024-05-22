import { ListPostsFilters } from "../../interfaces/post/listpostsfilters"
import { POST_STATUS } from "../../constants/post/poststatus"
import { POST_TYPE } from "../../constants/post/posttype"

/**
 * Replaces a character at a specific index in a given string with a new character.
 * @param {string} str - The original string.
 * @param {number} index - The index at which to replace the character.
 * @param {string} replacement - The new character to replace at the specified index.
 * @returns The updated string with the character replaced at the specified index.
 */
const replaceAt = (str: string, index: number, replacement: string) => {
  if (index < 0 || index >= str.length) {
    throw new Error("Index out of bounds")
  }
  return str.substring(0, index) + replacement + str.substring(index + 1)
}

/**
 * Validates the field and value of a specific filter in the ListPostsFilters object.
 * @param {FilterName} field - The field name to validate.
 * @param {ListPostsFilters[FilterName]} value - The value associated with the field.
 * @throws {Error} Throws an error if the field or value is invalid.
 * @returns None
 */
export function validateListPostsFiltersField<
  FilterName extends keyof ListPostsFilters
>(field: FilterName, value: ListPostsFilters[FilterName]) {
  switch (field) {
    case "owner": {
      const _value = value as ListPostsFilters["owner"]

      // Regex can be used
      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "string" || !_value.length)
        throw new Error('invalid parameter "filters.owner"')

      return
    }
    case "collections": {
      const _value = value as ListPostsFilters["collections"]

      if (_value === null || typeof _value === "undefined") return
      if (Array.isArray(_value) && typeof _value === "object") {
        const isNotValid = _value.some((el) => {
          return (
            Object.keys(el).length > 2 ||
            Object.keys(el).length < 2 ||
            !("address" in el) ||
            !("network" in el)
          )
        })

        if (isNotValid) throw new Error('invalid parameter "filters.collection')
      } else if (typeof _value === "object" && !Array.isArray(_value)) {
        if (Object.keys(_value).length > 2)
          throw new Error('invalid parameter "filters.collection')

        let integrityBitmap = "0000"
        const acceptableCombos = ["1100", "0010", "0011", "0001"]
        if ("address" in _value)
          integrityBitmap = replaceAt(integrityBitmap, 0, "1")
        if ("network" in _value)
          integrityBitmap = replaceAt(integrityBitmap, 1, "1")
        if ("wanted" in _value)
          integrityBitmap = replaceAt(integrityBitmap, 2, "1")
        if ("offered" in _value)
          integrityBitmap = replaceAt(integrityBitmap, 3, "1")

        if (acceptableCombos.indexOf(integrityBitmap) === -1)
          throw new Error('invalid parameter "filters.collection')
      }

      return
    }
    case "status": {
      const _value = value as ListPostsFilters["status"]

      if (_value === null || typeof _value === "undefined") return
      else if (
        (typeof _value !== "string" && typeof _value !== "number") ||
        (typeof _value === "string" &&
          !Object.keys(POST_STATUS).includes(_value)) ||
        (typeof _value === "number" &&
          !Object.values(POST_STATUS).includes(_value))
      )
        throw new Error('invalid parameter "filters.status"')

      return
    }
    case "type": {
      const _value = value as ListPostsFilters["type"]

      if (_value === null || typeof _value === "undefined") return
      else if (
        (typeof _value !== "string" && typeof _value !== "number") ||
        (typeof _value === "string" &&
          !Object.keys(POST_TYPE).includes(_value)) ||
        (typeof _value === "number" &&
          !Object.values(POST_TYPE).includes(_value))
      )
        throw new Error('invalid parameter "filters.type"')

      return
    }
    case "typeOffered": {
      const _value = value as ListPostsFilters["typeOffered"]

      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "string" || !/^[0-1][0-2][0-2]$/g.test(_value))
        throw new Error('invalid parameter "filters.typeOffered"')

      return
    }
    case "typeWanted": {
      const _value = value as ListPostsFilters["typeWanted"]

      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "string" || !/^[0-2]{3}$/g.test(_value))
        throw new Error('invalid parameter "filters.typeWanted"')

      return
    }
    case "verified": {
      const _value = value as ListPostsFilters["verified"]

      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "boolean")
        throw new Error('invalid parameter "filters.verified"')

      return
    }
    case "network": {
      const _value = value as ListPostsFilters["network"]

      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "string")
        throw new Error('invalid parameter "filters.network"')

      return
    }
    case "offers": {
      const _value = value as ListPostsFilters["offers"]

      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "number" || _value < 0)
        throw new Error('invalid parameter "filters.offers"')

      return
    }
    case "expirationDate": {
      const _value = value as ListPostsFilters["expirationDate"]

      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "number")
        throw new Error('invalid parameter "filters.expirationDate"')

      return
    }
    case "includeParent": {
      const _value = value as ListPostsFilters["includeParent"]

      if (_value === null || typeof _value === "undefined") return
      else if (typeof _value !== "boolean")
        throw new Error('invalid parameter "filters.includeParent"')

      return
    }
    default:
      throw new Error(`invalid parameter "filters.${field}"`)
  }
}
