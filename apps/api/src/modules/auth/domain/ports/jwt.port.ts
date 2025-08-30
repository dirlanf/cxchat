export interface JwtPort {
  signAccess(payload: object): Promise<string>;
  verifyAccess<T extends object = any>(token: string): Promise<T>;
}
export const JWT_PORT = Symbol('JWT_PORT');
