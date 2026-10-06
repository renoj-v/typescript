import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type Address,
  type AddressBook,
  type Contact,
  type ContactChanges,
  type NewContact,
  addContact,
  createAddressBook,
  findByTag,
  formatAddress,
  updateContact,
} from "./starter";

const home: Address = { street: "12 Analytical Way", city: "London", postcode: "N1 9GU", country: "UK" };

describe("types", () => {
  test("Address and NewContact", () => {
    expectTypeOf<Address>().toEqualTypeOf<{
      street: string;
      city: string;
      postcode?: string;
      country: string;
    }>();
    expectTypeOf<NewContact>().toEqualTypeOf<{
      name: string;
      email?: string;
      phone?: string;
      address?: Address;
      tags: string[];
    }>();
  });

  test("Contact adds a readonly id", () => {
    expectTypeOf<Contact>().toEqualTypeOf<{
      readonly id: number;
      name: string;
      email?: string;
      phone?: string;
      address?: Address;
      tags: string[];
    }>();
  });

  test("ContactChanges and AddressBook", () => {
    expectTypeOf<ContactChanges>().toEqualTypeOf<{
      name?: string;
      email?: string;
      phone?: string;
      address?: Address;
      tags?: string[];
    }>();
    expectTypeOf<AddressBook>().toEqualTypeOf<{
      readonly contacts: readonly Contact[];
      readonly nextId: number;
    }>();
  });

  test("signatures", () => {
    expectTypeOf(createAddressBook).toEqualTypeOf<() => AddressBook>();
    expectTypeOf(addContact).toEqualTypeOf<(book: AddressBook, contact: NewContact) => AddressBook>();
    expectTypeOf(findByTag).toEqualTypeOf<(book: AddressBook, tag: string) => Contact[]>();
    expectTypeOf(updateContact).toEqualTypeOf<
      (book: AddressBook, id: number, changes: ContactChanges) => AddressBook
    >();
    expectTypeOf(formatAddress).toEqualTypeOf<(address: Address) => string>();
  });

  test("misuse is rejected", () => {
    const book = createAddressBook();
    // @ts-expect-error - an update can't change the id
    updateContact(book, 1, { id: 99 });
    // @ts-expect-error - contacts is a readonly array
    book.contacts.push({ id: 1, name: "X", tags: [] });
  });
});

describe("behavior", () => {
  test("add, find and update contacts", () => {
    let book = createAddressBook();
    book = addContact(book, { name: "Ada", email: "ada@example.com", tags: ["vip"] });
    book = addContact(book, { name: "Grace", tags: [] });

    expect(book.nextId).toBe(3);
    expect(findByTag(book, "vip").map((c) => c.name)).toEqual(["Ada"]);

    const updated = updateContact(book, 2, { phone: "555-0100", tags: ["vip"] });
    expect(findByTag(updated, "vip").map((c) => c.name)).toEqual(["Ada", "Grace"]);
    expect(findByTag(book, "vip")).toHaveLength(1);
  });

  test("formatAddress", () => {
    expect(formatAddress(home)).toBe("12 Analytical Way\nLondon N1 9GU\nUK");
    const { postcode: _postcode, ...noPostcode } = home;
    expect(formatAddress(noPostcode)).toBe("12 Analytical Way\nLondon\nUK");
  });
});
