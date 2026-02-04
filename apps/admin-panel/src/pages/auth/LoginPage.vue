<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import AuthLayout from "../../layouts/AuthLayout.vue";
import { ref, computed } from "vue";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const login = () => {
  authStore.login(email.value, password.value);
};

const isLoading = computed(() => authStore.loading);
const error = computed(() => authStore.error);
</script>

<template>
  <AuthLayout>
    <div class="login-page">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" />
        </div>
        <button type="submit" :disabled="isLoading">Sign In</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </AuthLayout>
</template>

<style scoped lang="scss">
.login-page {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
}

.error {
  color: red;
}
</style>
