import { Conversation } from ".."

export const findAddedAndRemovedConversation = (
  originalArray: Conversation[],
  newArray: Conversation[]
): { added: Conversation[]; removed: Conversation[] } => {
  const added = newArray.filter(
    (newItem) =>
      !originalArray.some((originalItem) => originalItem.id === newItem.id)
  )

  const removed = originalArray.filter(
    (originalItem) =>
      !newArray.some((newItem) => newItem.id === originalItem.id)
  )

  return { added, removed }
}
