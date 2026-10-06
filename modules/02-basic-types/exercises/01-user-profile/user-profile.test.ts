import { describe, expect, expectTypeOf, test } from "vitest";
import { type UserProfile, addInterest, createProfile, describeProfile } from "./starter";

const ada: UserProfile = {
  id: 1,
  username: "ada",
  email: "ada@example.com",
  verified: true,
  interests: ["chess", "typescript"],
};

describe("UserProfile type", () => {
  test("has the right shape", () => {
    expectTypeOf<UserProfile>().toEqualTypeOf<{
      id: number;
      username: string;
      email: string;
      verified: boolean;
      interests: string[];
    }>();
  });

  test("functions are typed", () => {
    expectTypeOf(createProfile).toEqualTypeOf<(username: string, email: string) => UserProfile>();
    expectTypeOf(addInterest).toEqualTypeOf<(profile: UserProfile, interest: string) => UserProfile>();
    expectTypeOf(describeProfile).toEqualTypeOf<(profile: UserProfile) => string>();
  });
});

describe("createProfile", () => {
  test("starts unverified with no interests", () => {
    const profile = createProfile("grace", "grace@example.com");
    expect(profile).toMatchObject({
      username: "grace",
      email: "grace@example.com",
      verified: false,
      interests: [],
    });
  });

  test("ids are unique numbers", () => {
    const a = createProfile("a", "a@example.com");
    const b = createProfile("b", "b@example.com");
    expect(typeof a.id).toBe("number");
    expect(a.id).not.toBe(b.id);
  });
});

describe("addInterest", () => {
  test("adds a cleaned-up interest to the end", () => {
    expect(addInterest(ada, "  Poetry ").interests).toEqual(["chess", "typescript", "poetry"]);
  });

  test("ignores duplicates", () => {
    expect(addInterest(ada, "Chess").interests).toEqual(["chess", "typescript"]);
  });

  test("does not mutate the original", () => {
    const before = structuredClone(ada);
    const after = addInterest(ada, "poetry");
    expect(ada).toEqual(before);
    expect(after).not.toBe(ada);
    expect(after.interests).not.toBe(ada.interests);
  });
});

describe("describeProfile", () => {
  test("verified with interests", () => {
    expect(describeProfile(ada)).toBe("@ada (verified) likes: chess, typescript");
  });
  test("unverified", () => {
    expect(describeProfile({ ...ada, verified: false, interests: ["chess"] })).toBe("@ada likes: chess");
  });
  test("no interests", () => {
    expect(describeProfile({ ...ada, verified: false, interests: [] })).toBe("@ada has no interests yet");
    expect(describeProfile({ ...ada, interests: [] })).toBe("@ada (verified) has no interests yet");
  });
});
