# 04.04: Build `Admin` from `User` with `extends` and `&`

**Type:** ✍️ Write the code · **Time:** ~20 min

## Scenario

A store's back office has customers and admins. They share the basic user fields, but each has extras. Rather than copy and paste fields, build the types from a common base.

## Your task

1. **Types**
   - `Permission`: `"orders:read" | "orders:write" | "users:manage"`
   - `BaseUser`: `id: number`, `email: string`
   - `Customer` **extends** `BaseUser` with `loyaltyPoints: number`
   - `Admin` **extends** `BaseUser` with `permissions: Permission[]`
   - `Timestamps`: `createdAt: Date`, `updatedAt: Date`
   - `StoredAdmin`: an **intersection** of `Admin` and `Timestamps`
   - `IdConflict`: the intersection `{ id: string } & { id: number }`. Before you look at the tests, predict what type `IdConflict["id"]` is.
2. **Functions**
   - `promoteToAdmin(customer, permissions): Admin` keeps `id` and `email`. The result must **not** contain `loyaltyPoints` at runtime, even though TypeScript would accept extra fields there.
   - `can(admin, permission): boolean` is `true` if the admin has the permission. `"users:manage"` grants **every** permission.
   - `store(admin, now: Date): StoredAdmin` adds `createdAt` and `updatedAt`, both set to `now`.
   - `touch(stored, now: Date): StoredAdmin` returns a copy with only `updatedAt` changed.

## Acceptance criteria

- [ ] `Customer` and `Admin` are built from `BaseUser`, not by repeating its fields
- [ ] `StoredAdmin` has all the fields of `Admin` and `Timestamps`
- [ ] `promoteToAdmin` returns only `id`, `email` and `permissions`
- [ ] All tests pass

<details>
<summary>Why doesn't TypeScript stop loyaltyPoints from sneaking through?</summary>

`{ ...customer, permissions }` has type `Customer & { permissions }`, which is *assignable* to `Admin`, because extra properties are allowed when they don't come from a fresh object literal. Types describe the *minimum* shape, not the exact one. Build the object field by field.

</details>
