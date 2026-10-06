export type Permission = "orders:read" | "orders:write" | "users:manage";

export interface BaseUser {
  id: number;
  email: string;
}

// `extends` copies BaseUser's fields in, and errors right here if a field
// you add conflicts with one it inherits.
export interface Customer extends BaseUser {
  loyaltyPoints: number;
}

export interface Admin extends BaseUser {
  permissions: Permission[];
}

export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

// An intersection combines any two types, even ones that aren't interfaces.
export type StoredAdmin = Admin & Timestamps;

// Conflicting properties don't error. They become `never` (no value is
// both a string and a number), so you could never build an IdConflict.
export type IdConflict = { id: string } & { id: number };

export function promoteToAdmin(customer: Customer, permissions: Permission[]): Admin {
  // `return { ...customer, permissions }` would type-check, but would leak
  // `loyaltyPoints` into the admin object at runtime. Pick fields explicitly.
  return { id: customer.id, email: customer.email, permissions: [...permissions] };
}

export function can(admin: Admin, permission: Permission): boolean {
  return admin.permissions.includes("users:manage") || admin.permissions.includes(permission);
}

export function store(admin: Admin, now: Date): StoredAdmin {
  return { ...admin, createdAt: now, updatedAt: now };
}

export function touch(stored: StoredAdmin, now: Date): StoredAdmin {
  return { ...stored, updatedAt: now };
}
