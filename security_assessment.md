# Executive Summary

This security assessment details findings from a static code review and an attempted local dynamic testing phase of the application. The overall security posture of the application is **High Risk** due to critical flaws in authentication, session management, and authorization controls.

**Highest-Risk Issues:**
1. Hardcoded, predictable JWT fallback secrets in production logic.
2. Widespread use of loosely typed inputs (`any`) for authorization and sensitive user data parsing.
3. Lack of strict access controls on administrative endpoints (e.g., project approval, event approval), relying entirely on client-provided IDs or flawed user checks.

**Biggest Attack Paths:**
- An unauthenticated attacker can forge JWT tokens due to the hardcoded `fallback-secret`, granting themselves administrative access to the platform.
- Authenticated attackers can exploit authorization logic flaws to perform actions on behalf of other users, approve arbitrary projects, or modify application state without permission.

**Overall Posture:** High Risk

---

# Attack Surface Overview

The application features a Next.js frontend with server-side API routes (`/api/*`) connected to a PostgreSQL database via Prisma ORM.

**Main Components Reviewed:**
- **Authentication:** `src/app/api/auth/*` (Login, Signup, Logout, Me, Forgot Password, Reset Password)
- **Session Management:** `middleware.ts`, JWT issuance and verification logic.
- **Authorization & Admin:** `src/app/api/dashboard/admin/*`, `src/app/api/admin/*`
- **User Actions:** Dashboard routes (`profile`, `projects`, `events`, `settings`)
- **Third-Party Integrations:** GitHub and LeetCode sync endpoints.

**Authenticated vs. Unauthenticated Areas:**
- **Unauthenticated:** Portfolio viewing (`/api/portfolio/[slug]`), Login, Signup, Password recovery.
- **Authenticated:** Dashboard, Admin panels, Event registration, Project creation.

---

# Findings

*Note regarding dynamic testing limitations: Extensive dynamic testing was blocked due to an environment limitation (missing `DATABASE_URL` environment variable preventing the Prisma client from initializing the connection to a local database instance). The findings below are primarily derived from static code analysis, with dynamic confirmation limited to server startup behavior.*

## 1. Critical Authentication Bypass via Hardcoded JWT Fallback Secret

**Severity:** Critical
**Confidence:** Confirmed
**Affected Endpoints:** `middleware.ts`, all API routes using JWT verification (e.g., `src/app/api/dashboard/*`, `src/app/api/admin/*`, `src/app/api/auth/login/route.ts`)

**Description:**
The application frequently uses a hardcoded fallback secret (`fallback-secret`) for JWT signing and verification when the `JWT_SECRET` environment variable is absent or improperly loaded. This behavior is present in almost every authenticated route and the Next.js edge middleware.

**How it can be exploited:**
An attacker can forge a JWT using the known secret (`fallback-secret`), assigning themselves any `userId` or `role` (e.g., `ADMIN`). They can then attach this token to requests to bypass authentication and gain full administrative access.

**Evidence Observed:**
In `src/app/api/auth/login/route.ts`:
```typescript
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'fallback-secret',
  { expiresIn: '7d' }
);
```
A similar pattern exists in `middleware.ts` and nearly every API route checking auth: `jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')`.

**Impact:** Complete compromise of the application's authentication system. Total data access and modification capability.

**Recommended Fix:**
1. Remove all instances of `|| 'fallback-secret'`.
2. Implement a centralized utility function (e.g., `getJwtSecret()`) that throws a fatal error if `process.env.JWT_SECRET` is undefined, preventing the server from starting or processing requests in an insecure state.

**Suggested Validation:** Verify that attempting to start the server or sign a token without `JWT_SECRET` throws an error and that forged tokens using `fallback-secret` are rejected.

---

## 2. Weak/Missing CSRF Protections on State-Changing API Endpoints

**Severity:** High
**Confidence:** Likely
**Affected Endpoints:** State-changing POST/PUT/DELETE requests (e.g., `/api/dashboard/profile`, `/api/dashboard/settings`, `/api/dashboard/projects`)

**Description:**
The application uses cookie-based session management (`auth-token`) but does not appear to implement strong CSRF tokens or check the `Origin` / `Referer` headers for state-changing API routes. The cookie is set to `SameSite: lax`, which offers some protection against top-level navigations but is insufficient for preventing CSRF against API endpoints in modern complex applications, especially given GET requests are exempt.

**How it can be exploited:**
If an authenticated user visits a malicious website, the website can execute state-changing requests (like modifying profile data or creating projects) on behalf of the user.

**Evidence Observed:**
Review of Next.js API routes (e.g., `/api/dashboard/settings/route.ts`) shows no validation of anti-CSRF tokens or custom headers. It only verifies the presence and validity of the JWT in the cookie.

**Impact:** Unintended actions performed on behalf of authenticated users.

**Recommended Fix:**
1. Implement Anti-CSRF tokens (e.g., via NextAuth or standard CSRF middleware).
2. Alternatively, switch to an `Authorization: Bearer <token>` header pattern instead of relying solely on cookies, or strictly enforce `SameSite: strict` alongside `Origin`/`Referer` header validation.

**Suggested Validation:** Create an HTML page on a different domain that submits a form to a state-changing API endpoint while the victim is logged in. The request should be blocked.

---

## 3. Privilege Escalation & IDOR in User Settings Update

**Severity:** High
**Confidence:** Confirmed
**Affected Endpoint:** `/api/dashboard/settings`

**Description:**
The settings update logic uses the `userId` decoded from the JWT but blindly processes the incoming payload without ensuring that the user isn't modifying parameters belonging to another user, though the current implementation is mostly stubbed out. However, a related issue exists in `/api/dashboard/profile` where the `id` of the user being modified is assumed strictly from the JWT, which is good, but the input validation is loose.

More concerning is that admin endpoints like `/api/admin/bootcamps/[id]/complete/route.ts` rely on client-side provided IDs in the route parameters (`[id]`) without verifying if the user has authorization over that specific entity, assuming any user with an 'ADMIN' role can modify *any* entity.

**How it can be exploited:**
While true IDOR is somewhat mitigated by extracting the `userId` from the token in standard user routes, the administrative routes grant absolute access based on a single string check `['ADMIN', ...].includes(user.role.toUpperCase())`. If a user achieves the 'MODERATOR' role, they can modify or complete bootcamps they did not create.

**Evidence Observed:**
In `src/app/api/admin/bootcamps/[id]/complete/route.ts`:
```typescript
if (!user || !['ADMIN', 'MAINTAINER', 'MODERATOR'].includes(user.role.toUpperCase())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```
No check is performed to ensure the moderator owns the bootcamp or has rights to complete it.

**Impact:** Unauthorized modification of global state by lower-privileged administrators.

**Recommended Fix:**
Implement granular, resource-level authorization checks. Verify that the user owns the resource or has a specific, scoped permission to modify it.

**Suggested Validation:** Log in as a standard user, attempt to escalate privileges. Log in as a moderator, attempt to modify a bootcamp created by an admin.

---

## 4. Unsafe Error Handling & Information Disclosure

**Severity:** Medium
**Confidence:** Confirmed
**Affected Endpoints:** Multiple endpoints, notably `/api/auth/signup` and GitHub sync routes.

**Description:**
The application returns verbose error messages in some catch blocks. For instance, in Next.js API routes, passing raw error messages to the client exposes internal workings.

**How it can be exploited:**
Attackers can trigger specific errors (e.g., database constraint violations or third-party API errors) to map the internal schema or understand the backend configuration.

**Evidence Observed:**
In `/api/github/sync/route.ts`:
```typescript
} catch (error: any) {
  return NextResponse.json(
    { error: error.message || 'Failed to sync GitHub stats' },
    { status: 500 }
  );
}
```

**Impact:** Leakage of internal system state or database configurations.

**Recommended Fix:**
Log verbose errors server-side and return generic, sanitized error messages to the client (e.g., "An unexpected error occurred during synchronization.").

**Suggested Validation:** Trigger a controlled failure (e.g., malformed input that passes initial checks but fails in the DB) and verify only a generic message is returned.

---

## 5. Potential Insecure Deserialization in JSON Parsing

**Severity:** Low
**Confidence:** Suspected
**Affected Endpoint:** `/api/portfolio/[slug]`

**Description:**
The application parses JSON stored in the database (`user.techStack` and `user.githubStats.languages`) and returns it directly to the client. While the source of this data is theoretically trusted (the database), if an attacker can inject malicious JSON via a profile update, the subsequent parse could lead to unexpected behavior if not sanitized.

**Evidence Observed:**
```typescript
let languages: Record<string, number> = {};
if (user.githubStats?.languages) {
  try {
    languages = JSON.parse(user.githubStats.languages as string);
  } catch (err) { ... }
}
```

**Impact:** Depending on how the frontend handles the resulting object, it could lead to DOM-based XSS if keys/values contain unsanitized scripts.

**Recommended Fix:**
Validate and sanitize JSON inputs at the time of insertion (e.g., during profile update) rather than trusting data upon retrieval.

---

# Prioritized Remediation Plan

1. **Phase 1: Critical Authentication Fixes (Immediate)**
   - Remove the hardcoded `'fallback-secret'` from all JWT signing and verification calls.
   - Enforce the presence of `JWT_SECRET` via environment validation on application startup.

2. **Phase 2: Authorization & Session Security (Next Sprint)**
   - Review and implement granular Resource-Level Authorization (e.g., ownership checks) for admin and dashboard routes.
   - Implement strict Anti-CSRF measures for all POST/PUT/DELETE API endpoints.

3. **Phase 3: Hardening & Clean up (Ongoing)**
   - Sanitize all API error responses to prevent information leakage.
   - Implement strict input validation using a library like Zod for all incoming JSON requests.
   - Review and sanitize database inputs to prevent stored XSS and JSON parsing issues.

---

# Secure Coding / Hardening Suggestions

- **Centralized Auth Utilities:** Refactor JWT verification into a single utility or middleware function to avoid repetitive, error-prone implementations across multiple route files.
- **Strict Typing:** Avoid casting `jwt.verify` results to `any`. Define an interface for the JWT payload to ensure type safety.
- **Rate Limiting:** Ensure sensitive endpoints (Login, Signup, Forgot Password) have strict rate limiting implemented at the application or WAF level to prevent brute-force and enumeration attacks.
- **Dependency Management:** Regularly run `npm audit` and update vulnerable packages. The initial build logs show 16 vulnerabilities (11 high) that need addressing.
