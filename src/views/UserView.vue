<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-brand">
        <h2>Customer Portal</h2>
      </div>
      <button @click="handleLogout" class="logout-btn">Log out</button>
    </header>

    <main class="dashboard-content">
      
      <div v-if="!showApplyForm" class="quick-apply-card fade-in">
        <section class="actions-section">
          <h3>Apply for a New Loan</h3>
          <p class="section-desc">Type in the desired loan amount below to begin the application process.</p>
          <div class="quick-apply-box">
            <input 
              type="number" 
              v-model="quickAmount" 
              placeholder="Enter loan amount you want ($)" 
              class="quick-amount-input"
              min="1"
              required
            />
            <button @click="startApplication" class="apply-btn">Apply Now</button>
          </div>
        </section>
      </div>

      <div v-else class="form-container-card fade-in">
        <header class="form-header">
          <h3>Apply for a New Loan</h3>
          <p>Please provide the required details and upload verification documents.</p>
        </header>

        <form @submit.prevent="submitApplication" class="loan-form">
          <div class="form-section">
            <h4 class="section-title">1. Loan & Personal Details</h4>
            <div class="form-grid">
              <div class="form-group">
                <label for="applicant-name">Full Name</label>
                <input 
                  type="text" 
                  id="applicant-name" 
                  v-model="loanForm.name" 
                  placeholder="Enter your name" 
                  required
                />
              </div>
              <div class="form-group">
                <label for="applicant-email">Email Address</label>
                <input 
                  type="email" 
                  id="applicant-email" 
                  v-model="loanForm.email" 
                  placeholder="Enter your email" 
                  required
                />
              </div>
              <div class="form-group">
                <label for="applicant-age">Age</label>
                <input 
                  type="number" 
                  id="applicant-age" 
                  v-model="loanForm.age" 
                  placeholder="Enter your age" 
                  min="18" 
                  required
                />
              </div>
              <div class="form-group">
                <label for="loan-amount">Requested Loan Amount ($)</label>
                <input 
                  type="number" 
                  id="loan-amount" 
                  v-model="loanForm.amount" 
                  placeholder="Enter amount" 
                  min="1" 
                  required
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">2. Verification Documents</h4>
            
            <div class="doc-upload-grid">
              
              <div class="doc-group">
                <div class="doc-header">
                  <span class="doc-number">1</span>
                  <h5>NRC Document</h5>
                </div>
                <div class="doc-inputs solo">
                  <div class="file-upload-wrapper">
                    <label class="file-upload-btn">
                      <input type="file" @change="onFileSelected($event, 'nrc')" />
                      <span class="file-label-text">{{ fileNames.nrc || 'Choose NRC File' }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="doc-group">
                <div class="doc-header">
                  <span class="doc-number">2</span>
                  <h5>Photo / Selfie Verification</h5>
                </div>
                <div class="doc-inputs solo">
                  <div class="file-upload-wrapper">
                    <label class="file-upload-btn">
                      <input type="file" @change="onFileSelected($event, 'selfie')" />
                      <span class="file-label-text">{{ fileNames.selfie || 'Choose Selfie File' }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="doc-group">
                <div class="doc-header">
                  <span class="doc-number">3</span>
                  <h5>Smart Card</h5>
                </div>
                <div class="doc-inputs solo">
                  <div class="file-upload-wrapper">
                    <label class="file-upload-btn">
                      <input type="file" @change="onFileSelected($event, 'smartCard')" />
                      <span class="file-label-text">{{ fileNames.smartCard || 'Choose Smart Card File' }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="doc-group">
                <div class="doc-header">
                  <span class="doc-number">4</span>
                  <h5>Household Census Card</h5>
                </div>
                <div class="doc-inputs solo">
                  <div class="file-upload-wrapper">
                    <label class="file-upload-btn">
                      <input type="file" @change="onFileSelected($event, 'census')" />
                      <span class="file-label-text">{{ fileNames.census || 'Choose Census File' }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="doc-group">
                <div class="doc-header">
                  <span class="doc-number">5</span>
                  <h5>Passport</h5>
                </div>
                <div class="doc-inputs solo">
                  <div class="file-upload-wrapper">
                    <label class="file-upload-btn">
                      <input type="file" @change="onFileSelected($event, 'passport')" />
                      <span class="file-label-text">{{ fileNames.passport || 'Choose Passport File' }}</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="form-actions-row">
            <button type="button" @click="cancelApplication" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-form-btn">Submit Application</button>
          </div>
        </form>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"

const router = useRouter()
const toast = useToast()
const userEmail = ref('user@gmail.com')
const showApplyForm = ref(false)
const quickAmount = ref('')

const loanForm = ref({
  name: '',
  email: '',
  age: '',
  amount: '',
  nrcId: '',
  smartCardId: '',
  passportId: ''
})

const fileNames = ref({
  nrc: '',
  selfie: '',
  smartCard: '',
  census: '',
  passport: ''
})

const filesToUpload = ref({
  nrc: null,
  selfie: null,
  smartCard: null,
  census: null,
  passport: null
})

const onFileSelected = (event, type) => {
  const file = event.target.files[0]
  if (file) {
    fileNames.value[type] = file.name
    filesToUpload.value[type] = file
  }
}

onMounted(() => {
  const email = localStorage.getItem('user-email')
  if (email) {
    userEmail.value = email
    loanForm.value.email = email
  }
  
  const allApps = localStorage.getItem('lms-applications')
  if (!allApps) {
    localStorage.setItem('lms-applications', JSON.stringify([]))
  }
})

const startApplication = () => {
  if (!quickAmount.value || Number(quickAmount.value) <= 0) {
    toast.warning("Please enter a valid loan amount.")
    return
  }

  loanForm.value.amount = Number(quickAmount.value)
  showApplyForm.value = true
}

const submitApplication = async () => {

  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to apply.");
    return;
  }

  const documentIds = {};
  for (const type of Object.keys(filesToUpload.value)) {
    const file = filesToUpload.value[type];
    if (!file) continue;

    try {
      const urlRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: `documents/${Date.now()}-${file.name}`, contentType: file.type })
      });
      const urlData = await urlRes.json();
      console.log(urlData)
      if (!urlData.success) throw new Error("Failed to get upload URL");

      const formData = new FormData();
      for (const key in urlData.fields) {
        formData.append(key, urlData.fields[key]);
      }
      formData.append("file", file);

      const s3Res = await fetch(urlData.uploadUrl, {
        method: 'POST',
        body: formData
      });
      if (!s3Res.ok) throw new Error("Failed to upload to S3");

      const confirmRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/confirm-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          s3Key: urlData.fields.key,
          documentType: type,
          contentType: file.type
        })
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success && !confirmData.documentId) throw new Error("Failed to confirm upload");
      
      documentIds[type] = confirmData.documentId;
    } catch (e) {
      console.error(`Error uploading ${type}:`, e);
      toast.warning(`Failed to upload ${type}. Continuing anyway.`);
    }
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/request-loan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        amount: Number(loanForm.value.amount),
        name: loanForm.value.name,
        email: loanForm.value.email,
        age: Number(loanForm.value.age),
        type: 'Personal Loan',
        documents: {
          nrc: { id: documentIds.nrc || '', file: fileNames.value.nrc },
          selfie: { id: documentIds.selfie || '', file: fileNames.value.selfie },
          smartCard: { id: documentIds.smartCard || '', file: fileNames.value.smartCard },
          census: { id: documentIds.census || '', file: fileNames.value.census },
          passport: { id: documentIds.passport || '', file: fileNames.value.passport }
        }
      })
    });
    
    if (!res.ok) {
      const err = await res.json();
      if (err.availablePool !== undefined) {
        toast.error(`${err.error}\nMax available pool: $${err.availablePool}\nYou requested: $${err.requestedAmount}`);
      } else {
        toast.error(err.error || "Failed to submit loan request");
      }
      return;
    }
  } catch (e) {
    toast.error("Connection error with backend. " + e.message);
    return;
  }

  toast.success("Loan application submitted successfully! It is now pending review.")
  
  showApplyForm.value = false
  quickAmount.value = ''
  loanForm.value.amount = ''
  loanForm.value.age = ''
  loanForm.value.nrcId = ''
  loanForm.value.smartCardId = ''
  loanForm.value.passportId = ''
  fileNames.value = { nrc: '', selfie: '', smartCard: '', census: '', passport: '' }
  filesToUpload.value = { nrc: null, selfie: null, smartCard: null, census: null, passport: null }
}

const cancelApplication = () => {
  showApplyForm.value = false
  quickAmount.value = ''
}

const handleLogout = () => {
  localStorage.removeItem('user-role')
  localStorage.removeItem('user-email')
  router.push('/')
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f9fafb;
  color: var(--text-main);
  font-family: var(--font-body);
}

.dashboard-header {
  background-color: #fff;
  border-bottom: 1px solid var(--input-border);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand h2 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 2px;
}

.welcome-msg {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.logout-btn {
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.dashboard-content {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.quick-apply-card {
  background-color: #fff;
  padding: 40px;
  border-radius: var(--border-radius);
  border: 1px solid var(--input-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.actions-section h3 {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  margin-bottom: 8px;
}

.section-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.quick-apply-box {
  display: flex;
  gap: 12px;
  align-items: center;
  max-width: 500px;
}

.quick-amount-input {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  outline: none;
  background-color: #fff;
}

.quick-amount-input:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 4px var(--primary-glow);
}

.apply-btn {
  padding: 14px 28px;
  background-color: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(97, 59, 155, 0.15);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.apply-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.form-container-card {
  background-color: #fff;
  padding: 40px;
  border-radius: var(--border-radius);
  border: 1px solid var(--input-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.form-header {
  margin-bottom: 32px;
}

.form-header h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: 6px;
}

.form-header p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.loan-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary);
  border-bottom: 1px solid var(--input-border);
  padding-bottom: 8px;
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: -8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  outline: none;
  font-size: 0.9rem;
}

.form-group input:focus {
  border-color: var(--input-focus);
}

.doc-upload-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.doc-group {
  border: 1px solid var(--input-border);
  border-radius: 8px;
  padding: 20px;
  background-color: #fafbfc;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.doc-number {
  background-color: var(--primary-light);
  color: var(--primary);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.doc-header h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
}

.doc-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: center;
}

.doc-inputs.solo {
  grid-template-columns: 1fr;
}

.doc-inputs input {
  padding: 10px 14px;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  outline: none;
  font-size: 0.9rem;
  background-color: #fff;
}

.doc-inputs input:focus {
  border-color: var(--input-focus);
}

.file-upload-wrapper {
  position: relative;
  width: 100%;
}

.file-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border: 1px dashed var(--primary);
  border-radius: var(--border-radius);
  background-color: #fff;
  cursor: pointer;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  transition: all 0.2s ease;
}

.file-upload-btn:hover {
  background-color: var(--primary-light);
}

.file-upload-btn input[type="file"] {
  display: none;
}

.file-label-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
}

.form-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid var(--input-border);
  padding-top: 24px;
}

.cancel-btn {
  padding: 12px 24px;
  background-color: #fff;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
}

.submit-form-btn {
  padding: 12px 24px;
  background-color: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(97, 59, 155, 0.15);
}

.submit-form-btn:hover {
  background-color: var(--primary-hover);
}

.fade-in {
  animation: fadeIn 0.25s ease forwards;
}

</style>
