export interface UserLoginType {
  token: string;
  refresh_token: string;
  user: {
    id: object;
    username: string;
  };
}
