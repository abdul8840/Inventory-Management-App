export type UserRole = 'owner' | 'admin' | 'member';

export interface AppUser {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface AuthSession {
  token: string;
  user: AppUser;
}
