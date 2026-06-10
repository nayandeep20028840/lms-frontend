
<template>
  <div class="auth-container">
    <div class="form-panel">
      <div class="form-card">
        <header class="form-header">
          <h1>{{ isSignUp ? 'Create an account' : 'Welcome back' }}</h1>
          <p>{{ isSignUp ? 'Please enter your details to sign up' : 'Please enter your details' }}</p>
        </header>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div v-if="isSignUp" class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              placeholder="Enter your name" 
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Enter your email" 
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="••••••••" 
              required
            />
          </div>

          <div v-if="isSignUp" class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              v-model="confirmPassword" 
              placeholder="••••••••" 
              required
            />
          </div>

          <div v-if="!isSignUp" class="form-actions">
            <router-link to="/forgot-password" class="forgot-password">Forgot password?</router-link>
          </div>
          <button type="submit" class="submit-btn">
            {{ isSignUp ? 'Sign up' : 'Sign in' }}
          </button>
        </form>

        <footer class="form-footer">
          <span v-if="!isSignUp">
            Don't have an account? 
            <a href="#" @click.prevent="toggleMode">Sign up</a>
          </span>
          <span v-else>
            Already have an account? 
            <a href="#" @click.prevent="toggleMode">Log in</a>
          </span>
        </footer>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"

const router = useRouter()
const toast = useToast()
const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  name.value = ''
}

const handleSubmit = async () => {
  if (isSignUp.value) {
    if (password.value !== confirmPassword.value) {
      toast.warning("Passwords do not match!")
      return
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
          phn: '0000000000'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }
      toast.success(`Sign up successful for ${name.value}! You can now sign in.`)
      toggleMode()
    } catch (e) {
      toast.error("Failed to connect to backend for signup.");
    }
  } else {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user-role', data.user.role);
      localStorage.setItem('user-email', data.user.email);
      router.push(data.user.role === 'admin' ? '/admin' : '/user');
    } catch (e) {
      toast.error("Failed to connect to backend for login.");
    }
  }
}
</script>


<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 24px;
}

.form-panel {
  background-color: var(--bg-color);
  padding: 48px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 440px;
  display: flex;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h1 {
  font-family: var(--font-heading);
  font-size: 2.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
}

.form-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-main);
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.95rem;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  background-color: #fff;
  color: var(--text-main);
  outline: none;
}

.form-group input:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 4px var(--primary-glow);
}

.form-group input::placeholder {
  color: #b0b4be;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.forgot-password {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
}

.submit-btn {
  width: 100%;
  padding: 13px;
  background-color: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(97, 59, 155, 0.2);
}

.submit-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(97, 59, 155, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.form-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.form-footer a {
  margin-left: 4px;
}

</style>
