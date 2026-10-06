// Copied from a JavaScript codebase. Describe the data with types,
// then annotate every function. See README.md for the exact shapes.

// TODO: Address, NewContact, Contact, ContactChanges, AddressBook

export function createAddressBook() {
  return { contacts: [], nextId: 1 };
}

export function addContact(book, contact) {
  const created = { ...contact, id: book.nextId };
  return { contacts: [...book.contacts, created], nextId: book.nextId + 1 };
}

export function findByTag(book, tag) {
  return book.contacts.filter((contact) => contact.tags.includes(tag));
}

export function updateContact(book, id, changes) {
  return {
    ...book,
    contacts: book.contacts.map((contact) => (contact.id === id ? { ...contact, ...changes } : contact)),
  };
}

export function formatAddress(address) {
  const cityLine = address.postcode ? `${address.city} ${address.postcode}` : address.city;
  return [address.street, cityLine, address.country].join("\n");
}
