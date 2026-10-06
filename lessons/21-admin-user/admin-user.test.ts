import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type Admin,
  type BaseUser,
  type Customer,
  type IdConflict,
  type Permission,
  type StoredAdmin,
  type Timestamps,
  can,
  promoteToAdmin,
  store,
  touch,
} from "./starter";

const customer: Customer = { id: 7, email: "ada@example.com", loyaltyPoints: 120 };
const jan = new Date("2026-01-01");
const feb = new Date("2026-02-01");

describe("types", () => {
  test("base and derived users", () => {
    expectTypeOf<Permission>().toEqualTypeOf<"orders:read" | "orders:write" | "users:manage">();
    expectTypeOf<BaseUser>().toEqualTypeOf<{ id: number; email: string }>();
    expectTypeOf<Customer>().toEqualTypeOf<{ id: number; email: string; loyaltyPoints: number }>();
    expectTypeOf<Admin>().toEqualTypeOf<{ id: number; email: string; permissions: Permission[] }>();
    expectTypeOf<Customer>().toExtend<BaseUser>();
    expectTypeOf<Admin>().toExtend<BaseUser>();
  });

  test("intersections", () => {
    expectTypeOf<Timestamps>().toEqualTypeOf<{ createdAt: Date; updatedAt: Date }>();
    expectTypeOf<StoredAdmin>().toExtend<Admin>();
    expectTypeOf<StoredAdmin>().toExtend<Timestamps>();
    expectTypeOf<StoredAdmin>().toEqualTypeOf<Admin & Timestamps>();
    expectTypeOf<IdConflict["id"]>().toBeNever();
  });

  test("signatures", () => {
    expectTypeOf(promoteToAdmin).toEqualTypeOf<(customer: Customer, permissions: Permission[]) => Admin>();
    expectTypeOf(can).toEqualTypeOf<(admin: Admin, permission: Permission) => boolean>();
    expectTypeOf(store).toEqualTypeOf<(admin: Admin, now: Date) => StoredAdmin>();
    expectTypeOf(touch).toEqualTypeOf<(stored: StoredAdmin, now: Date) => StoredAdmin>();
  });
});

describe("promoteToAdmin", () => {
  test("keeps only admin fields", () => {
    expect(promoteToAdmin(customer, ["orders:read"])).toStrictEqual({
      id: 7,
      email: "ada@example.com",
      permissions: ["orders:read"],
    });
  });
});

describe("can", () => {
  test("checks permissions", () => {
    const reader = promoteToAdmin(customer, ["orders:read"]);
    expect(can(reader, "orders:read")).toBe(true);
    expect(can(reader, "orders:write")).toBe(false);
  });
  test("users:manage grants everything", () => {
    const boss = promoteToAdmin(customer, ["users:manage"]);
    expect(can(boss, "orders:write")).toBe(true);
  });
});

describe("timestamps", () => {
  test("store sets both timestamps", () => {
    const stored = store(promoteToAdmin(customer, []), jan);
    expect(stored.createdAt).toBe(jan);
    expect(stored.updatedAt).toBe(jan);
  });
  test("touch only changes updatedAt", () => {
    const stored = store(promoteToAdmin(customer, []), jan);
    const touched = touch(stored, feb);
    expect(touched.createdAt).toBe(jan);
    expect(touched.updatedAt).toBe(feb);
    expect(stored.updatedAt).toBe(jan);
  });
});
