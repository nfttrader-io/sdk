import Post from "./post"

type CreatePost = Omit<
  Post,
  | "id"
  | "isOwner"
  | "parentId"
  | "score"
  | "like"
  | "assetsChecked"
  | "status"
  | "typeWanted"
  | "typeOffered"
  | "accepted"
  | "createdAt"
  | "numberOffers"
  | "creator"
  | "spicyest"
> & { creator: string }

export default CreatePost
