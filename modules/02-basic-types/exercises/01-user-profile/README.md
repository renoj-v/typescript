# 02.01: Annotate a user profile

**Type:** ✍️ Write the code · **Time:** ~15 min

## Scenario

You're building the profile page for a book-club app. Start by describing a profile with a type, then write three small functions that work with it.

## Your task

1. Replace `UserProfile = unknown` with an object type with these fields:

   | Field | Type |
   |---|---|
   | `id` | number |
   | `username` | string |
   | `email` | string |
   | `verified` | boolean |
   | `interests` | array of strings |

2. Implement the functions, adding parameter and return types:
   - `createProfile(username, email)` returns a new profile with a **unique** numeric `id`, `verified: false` and no interests.
   - `addInterest(profile, interest)` returns a **new** profile (don't mutate the original) with the interest trimmed and lowercased and added to the end. If it's already there, return a copy with interests unchanged.
   - `describeProfile(profile)` returns:
     - `"@ada (verified) likes: chess, typescript"` for a verified user with interests
     - `"@ada likes: chess"` when not verified
     - `"@ada has no interests yet"` when `interests` is empty (with ` (verified)` after the name if verified)

## Acceptance criteria

- [ ] `UserProfile` matches the table exactly
- [ ] All three functions have typed parameters and return `UserProfile` / `string`
- [ ] `addInterest` never mutates its input
- [ ] All tests pass

<details>
<summary>Hint: copying with a new array</summary>

```ts
return { ...profile, interests: [...profile.interests, cleaned] };
```

</details>
