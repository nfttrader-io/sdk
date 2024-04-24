export interface MessageReport {
  id: string
  description: string
  messageReportsId: string
  //#user
  userId: string
  createdAt: Date
  updatedAt: Date | null
}
