export class CreateUserDto {}
export enum Role {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
  Dev = 'dev',
  Iso = 'iso',
  Customer = 'customer',
}
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
