export interface Address {
  street: string;
  city: string;
  postcode?: string;
  country: string;
}

// What callers provide: the book assigns the id.
export interface NewContact {
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  tags: string[];
}

// A stored contact is a NewContact plus an id that never changes.
export interface Contact extends NewContact {
  readonly id: number;
}

// Every field is optional and there's no `id`, so excess property checks
// reject `{ id: 99 }` passed as a literal. (Part 8: `Partial<NewContact>`.)
export interface ContactChanges {
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
  tags?: string[];
}

export interface AddressBook {
  readonly contacts: readonly Contact[];
  readonly nextId: number;
}

// Without a return annotation, `contacts: []` would be inferred as `never[]`,
// an array you can never add to. The annotation tells TS what it will hold.
export function createAddressBook(): AddressBook {
  return { contacts: [], nextId: 1 };
}

export function addContact(book: AddressBook, contact: NewContact): AddressBook {
  const created: Contact = { ...contact, id: book.nextId };
  return { contacts: [...book.contacts, created], nextId: book.nextId + 1 };
}

export function findByTag(book: AddressBook, tag: string): Contact[] {
  return book.contacts.filter((contact) => contact.tags.includes(tag));
}

export function updateContact(book: AddressBook, id: number, changes: ContactChanges): AddressBook {
  return {
    ...book,
    contacts: book.contacts.map((contact) => (contact.id === id ? { ...contact, ...changes } : contact)),
  };
}

export function formatAddress(address: Address): string {
  // `address.postcode` is `string | undefined` here, and an empty string is
  // treated as "no postcode" too.
  const cityLine = address.postcode ? `${address.city} ${address.postcode}` : address.city;
  return [address.street, cityLine, address.country].join("\n");
}
