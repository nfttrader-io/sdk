/**
 * Defines a custom type `PostTypeName` that can only have one of the specified values: "A1", "A2", "B1", "B2", "C1", or "R1".
 * This type is used to restrict the possible values that a variable of type `PostTypeName` can hold.
 */
type PostTypeName = "A1" | "A2" | "B1" | "B2" | "C1" | "R1"

export { PostTypeName }
