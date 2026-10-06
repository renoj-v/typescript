// A named object type. Every place that takes a profile now agrees on its shape.
export type UserProfile = {
  id: number;
  username: string;
  email: string;
  verified: boolean;
  interests: string[];
};

// `let` + a number → inferred as `number`. No annotation needed.
let nextId = 1;

// The return annotation makes TypeScript check the object literal against
// `UserProfile`. Misspell a field or forget one and you'll hear about it here.
export function createProfile(username: string, email: string): UserProfile {
  return { id: nextId++, username, email, verified: false, interests: [] };
}

export function addInterest(profile: UserProfile, interest: string): UserProfile {
  const cleaned = interest.trim().toLowerCase();
  if (profile.interests.includes(cleaned)) {
    // Still a copy, so callers can rely on "always returns a new object".
    return { ...profile, interests: [...profile.interests] };
  }
  // Spreading creates new objects/arrays instead of mutating the input.
  // (Module 04 shows how `readonly` can enforce this at the type level.)
  return { ...profile, interests: [...profile.interests, cleaned] };
}

export function describeProfile(profile: UserProfile): string {
  const name = `@${profile.username}${profile.verified ? " (verified)" : ""}`;
  if (profile.interests.length === 0) return `${name} has no interests yet`;
  return `${name} likes: ${profile.interests.join(", ")}`;
}
