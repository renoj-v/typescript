// TODO: define the types. See README.md.
export type Permission = unknown;
export type BaseUser = unknown;
export type Customer = unknown;
export type Admin = unknown;
export type Timestamps = unknown;
export type StoredAdmin = unknown;
export type IdConflict = unknown;

export function promoteToAdmin(customer, permissions) {
  throw new Error("TODO: promoteToAdmin");
}

export function can(admin, permission) {
  throw new Error("TODO: can");
}

export function store(admin, now) {
  throw new Error("TODO: store");
}

export function touch(stored, now) {
  throw new Error("TODO: touch");
}
