// components/types/api.ts

import { User } from "../types/user";

export interface CurrentUserResponse {
  user: User | null;
}