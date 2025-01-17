import { User } from "./User";
import {PostImage} from "@/model/PostImage";

interface UserId {
  userId: string;
}

export interface Post {
  postId: number | undefined;
  User: User;
  content: string;
  createdAt: Date;
  Images: PostImage[],
  Hearts: UserId[],
  Reposts: UserId[],
  Comments : UserId[],
  _count: {
    Hearts: number,
    Reposts: number,
    Comments: number,
  },
  Original? :Post;
  Parent?: Post;
}
