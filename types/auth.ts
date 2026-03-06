export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  email: string;
  name: string;
  token: string;
}

export interface GetCurrentResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface SignOutResponse {
  message: string;
}