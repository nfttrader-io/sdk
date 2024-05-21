import Maybe from "./maybe"

export default interface HTTPRequestInit {
  method: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Maybe<{ [k: string]: string }>
  body?: Maybe<{ [k: string]: any }>
}
