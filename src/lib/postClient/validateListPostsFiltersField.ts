import ListPostsFilters from "../../types/postClient/listPostsFilters"
import contracts from "../contracts"
import POST_STATUS from "./postStatus"
import POST_TYPE from "./postType"

export default function validateListPostsFiltersField<
  FilterName extends keyof ListPostsFilters
>(field: FilterName, value: ListPostsFilters[FilterName]) {
  switch (field) {
    case "owner": {
      const _value = value as ListPostsFilters["owner"]

      // Regex can be used
      if (_value === null || _value === undefined) return
      else if (typeof _value !== "string" || !_value.length)
        throw new Error('invalid parameter "filters.owner"')

      return
    }
    case "collections": {
      const _value = value as ListPostsFilters["collections"]

      if (_value === null || _value === undefined) return
      else if (
        (typeof _value !== "string" &&
          !Array.isArray(_value) &&
          _value.constructor &&
          _value.constructor !== new Object().constructor) ||
        (typeof _value === "string" && !_value.length) ||
        (Array.isArray(_value) &&
          (!_value.length ||
            _value.some(c => typeof c !== "string" || !c.length))) ||
        _value.constructor === new Object().constructor
      ) {
        if (
          _value.constructor === new Object().constructor &&
          typeof _value !== "string" &&
          !Array.isArray(_value)
        ) {
          if (!Object.keys(_value).length)
            throw new Error('invalid parameter "filters.collections"')

          if (
            (_value.offered &&
              typeof _value.offered !== "string" &&
              !Array.isArray(_value.offered)) ||
            (Array.isArray(_value.offered) &&
              _value.offered.some(o => typeof o !== "string" || !o.length))
          )
            throw new Error('invalid parameter "filters.collections.offered"')
          if (
            (_value.wanted &&
              typeof _value.wanted !== "string" &&
              !Array.isArray(_value.wanted)) ||
            (Array.isArray(_value.wanted) &&
              _value.wanted.some(w => typeof w !== "string" || !w.length))
          )
            throw new Error('invalid parameter "filters.collections.wanted"')

          const invalidKeys = Object.keys(_value).filter(
            k => !["offered", "wanted"].includes(k)
          )
          if (invalidKeys.length)
            throw new Error(
              `invalid parameter "filters.collections.${invalidKeys[0]}"`
            )

          return
        }

        throw new Error('invalid parameter "filters.collections"')
      }

      return
    }
    case "status": {
      const _value = value as ListPostsFilters["status"]

      if (_value === null || _value === undefined) return
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

      if (_value === null || _value === undefined) return
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

      if (_value === null || _value === undefined) return
      else if (typeof _value !== "string" || !/^[0-1]{3}$/g.test(_value))
        throw new Error('invalid parameter "filters.typeOffered"')

      return
    }
    case "typeWanted": {
      const _value = value as ListPostsFilters["typeWanted"]

      if (_value === null || _value === undefined) return
      else if (typeof _value !== "string" || !/^[0-1]{3}$/g.test(_value))
        throw new Error('invalid parameter "filters.typeWanted"')

      return
    }
    case "verified": {
      const _value = value as ListPostsFilters["verified"]

      if (_value === null || _value === undefined) return
      else if (typeof _value !== "boolean")
        throw new Error('invalid parameter "filters.verified"')

      return
    }
    case "networks": {
      const _value = value as ListPostsFilters["networks"]
      const { royaltyRegistriesEngines } = contracts

      if (_value === null || _value === undefined) return
      else if (
        (typeof _value !== "number" && !Array.isArray(_value)) ||
        (typeof _value === "number" &&
          (!_value ||
            !Object.keys(royaltyRegistriesEngines).includes(`${_value}`))) ||
        (Array.isArray(_value) &&
          (!_value.length ||
            _value.some(
              _v =>
                typeof _v !== "number" ||
                !_v ||
                !Object.keys(royaltyRegistriesEngines).includes(`${_v}`)
            )))
      )
        throw new Error('invalid parameter "filters.networks"')

      return
    }
    case "deals": {
      const _value = value as ListPostsFilters["deals"]

      if (_value === null || _value === undefined) return
      else if (typeof _value !== "number" || _value < 0)
        throw new Error('invalid parameter "filters.deals"')

      return
    }
    case "expirationDate": {
      const _value = value as ListPostsFilters["expirationDate"]

      if (_value === null || _value == undefined) return
      else if (typeof _value !== "number" || _value <= Date.now())
        throw new Error('invalid parameter "filters.expirationDate"')

      return
    }
    default:
      throw new Error(`invalid parameter "filters.${field}"`)
  }
}