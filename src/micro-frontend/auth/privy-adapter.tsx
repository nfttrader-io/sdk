import React from "react"
import { createRoot, Root } from "react-dom/client"
import { v4 as uuid } from "uuid"

export class PrivyAdapter {
  private container: HTMLElement

  private root: Root

  constructor() {
    this.container = document.createElement("div")
    this.container.id = uuid()

    document.body.appendChild(this.container)

    this.root = createRoot(this.container!)
  }

  faiQualcosa() {}

  cleanup() {
    this.root.unmount()
    document.body.removeChild(this.container)
  }
}
