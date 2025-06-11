import { User } from './user.model';

export interface UserContext {
  user: User;
  delegate: User;
}
