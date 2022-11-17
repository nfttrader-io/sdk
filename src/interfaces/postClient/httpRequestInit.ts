export default interface HTTPRequestInit {
  method: "GET" | "POST" | "PUT" | "DELETE"
  body?: { [k: string]: any } | null
}
