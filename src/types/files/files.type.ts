export type FileOptions = {
  avatar?: boolean;
  path?: string;
  format?: string;
  height?: number;
  width?: number;
  overwrite?: boolean;
  transform?: string;
  tags?: string[];
  radius?: number;
  formats?: string[] | [];
  alt?: string;
};

export enum Path {
  AVATAR = "chapter/avatars",
  POSTS = "chapter/posts",
  BOOKS = "chapter/books",
}
