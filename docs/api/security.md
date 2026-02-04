# Security & Authentication

This document outlines the security measures implemented in the API, specifically focusing on CSRF protection.

## CSRF Protection

We use a **Double Submit Cookie** pattern to protect against Cross-Site Request Forgery (CSRF) attacks.

### Implementation Strategy

The logic is segmented into three specialized functions in `src/middleware/csrfMiddleware.ts`:

1. **`csrfMiddleware`**: The global initializer. It generates the token using `tokens.create(secret)` and sets it in a `httpOnly`, `secure`, `sameSite: lax` cookie.
2. **`verifyCsrfToken`**: The strict validator. It intercepts write methods (POST, PUT, DELETE, PATCH) and compares the cookie value against the `x-csrf-token` header.
3. **`rotateCsrfToken`**: The rotation utility. Used during critical events like **Login** to assign a new secret and token, mitigating Session Fixation attacks.

### Validation Logic

1.**HttpOnly Cookie**: The server sets a `csrfToken` cookie (not accessible to JS). 2. **CSRF Header**: The client sends the token value in the `x-csrf-token` header. 3. **Verification**: The `verifyCsrfToken` middleware ensures they match before allowing the request to proceed.

## Development & Testing (Postman)

To facilitate API testing without a frontend, we use Postman scripts:

1.**Auto-Capture**: A Global Post-response script captures the `csrfToken` from the response body of `GET /auth/csrf-token` or valid login responses.
`javascript
    // Postman Tests tab
    var jsonData = pm.response.json();
    if (jsonData.csrfToken) {
      pm.environment.set("csrfToken", jsonData.csrfToken);
    }
    ` 2. **Dynamic Header**: Requests validation via the `x-csrf-token` header set to `{{csrfToken}}`.

### Authentication Flow

Since the frontend cannot read the `httpOnly` cookie directly, it must first **fetch** the token value from the server before making any state-changing requests (POST, PUT, DELETE).

#### 1. Fetch the Token

Make a `GET` request to the token endpoint. The server will return the token in the response body.

- **Endpoint**: `GET /api/v1/auth/csrf-token`
- **Response**: `{ "csrfToken": "..." }`

#### 2. Send in Headers

Include the token in the `x-csrf-token` header for your login or mutation requests.

### Frontend Example (Vue.js)

```javascript
<script setup lang="ts">
import { ref, onMounted } from "vue";

const email = ref("");
const password = ref("");
const csrfToken = ref<string | null>(null);

// 1. Fetch the token on component mount
onMounted(async () => {
  try {
    const response = await fetch("/api/v1/auth/csrf-token");
    const data = await response.json();
    csrfToken.value = data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
});

const handleSubmit = async () => {
  if (!csrfToken.value) {
    alert("Secure connection not established. Please reload.");
    return;
  }

  try {
    // 2. Send token in headers
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken.value,
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      console.log("Login successful");
    } else {
      console.error("Login failed");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- ... inputs ... -->
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit" :disabled="!csrfToken">Login</button>
  </form>
</template>
```
