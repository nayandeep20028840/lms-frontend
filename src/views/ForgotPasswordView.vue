<template>
  <div class="auth-container">
    <div class="form-panel">
      <div class="form-card">
        <header class="form-header">
          <h1 v-if="step === 1">Forgot Password</h1>
          <h1 v-if="step === 2">Enter OTP</h1>
          <h1 v-if="step === 3">Reset Password</h1>
          <h1 v-if="step === 4">Password Reset Successful</h1>
          
          <p v-if="step === 1">Enter your email to receive an OTP</p>
          <p v-if="step === 2">We've sent an OTP to {{ email }}</p>
          <p v-if="step === 3">Please enter your new password below</p>
          <p v-if="step === 4">You can now log in with your new password</p>
        </header>

        <form v-if="step === 1" @submit.prevent="handleEmailSubmit" class="auth-form">
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
          <button type="submit" class="submit-btn">Send OTP</button>
        </form>

        <form v-if="step === 2" @submit.prevent="handleOtpSubmit" class="auth-form">
          <div class="form-group">
            <label for="otp">One-Time Password</label>
            <input 
              type="text" 
              id="otp" 
              v-model="otp" 
              placeholder="Enter 6-digit OTP" 
              required
            />
          </div>
          <button type="submit" class="submit-btn">Verify OTP</button>
        </form>

        <form v-if="step === 3" @submit.prevent="handlePasswordSubmit" class="auth-form">
          <div class="form-group">
            <label for="new-password">New Password</label>
            <input 
              type="password" 
              id="new-password" 
              v-model="newPassword" 
              placeholder="••••••••" 
              required
            />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              v-model="confirmPassword" 
              placeholder="••••••••" 
              required
            />
          </div>
          <button type="submit" class="submit-btn">Reset Password</button>
        </form>

        <div v-if="step === 4" class="auth-form">
          <router-link to="/login" class="submit-btn" style="text-align: center; display: block; text-decoration: none;">
            Back to Login
          </router-link>
        </div>

        <footer class="form-footer" v-if="step !== 4">
          <span>
            Remember your password? 
            <router-link to="/login">Log in</router-link>
          </span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from "vue-toastification"

const toast = useToast()
const step = ref(1)
const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const handleEmailSubmit = () => {
  if (email.value) {
    step.value = 2
  }
}

const handleOtpSubmit = () => {
  if (otp.value) {
    step.value = 3
  }
}

const handlePasswordSubmit = () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.warning("Passwords do not match!")
    return
  }
  step.value = 4
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
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}
</style>
