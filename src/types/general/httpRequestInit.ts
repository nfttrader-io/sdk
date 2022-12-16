export default interface HTTPRequestInit {
  method: "GET" | "POST" | "PUT" | "DELETE"
  headers?: { [k: string]: string } | null
  body?: { [k: string]: any } | null
}
