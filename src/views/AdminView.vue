<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-brand">
        <h2>Admin Portal</h2>
      </div>
      <div class="header-actions">
        <button @click="goToTransactions" class="transactions-btn">Transaction History</button>
        <button @click="handleLogout" class="logout-btn">Log out</button>
      </div>
    </header>

    <main class="dashboard-content">
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Outlay</div>
          <div class="stat-value">{{ formatAmount(totalOutlay) }}</div>
        </div>
      </section>

      <section class="applications-section">
        <h3>Pending Loan Applications</h3>
        
        <div class="table-container" v-if="pendingApplications.length > 0">
          <table class="applications-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Type</th>
                <th>Amount</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in pendingApplications" :key="app.id">
                <td>
                  <div class="applicant-name">{{ app.name }}</div>
                  <div class="applicant-email">{{ app.email }}</div>
                </td>
                <td>{{ app.type }}</td>
                <td class="bold-text">{{ formatAmount(app.amount) }}</td>
                <td class="actions-cell">
                  <button @click="approveApplication(app)" class="action-btn approve">Approve</button>
                  <button @click="rejectApplication(app)" class="action-btn reject">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="empty-state" v-else>
          <p>No pending applications left to review. You are all caught up!</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"

const router = useRouter()
const toast = useToast()
const adminEmail = ref('admin@gmail.com')

const pendingApplications = ref([])
const totalOutlay = ref(0)
let pollingInterval = null

onMounted(async () => {
  const email = localStorage.getItem('user-email')
  if (email) {
    adminEmail.value = email
  }
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/pool`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      totalOutlay.value = data.availablePool || 0;
    }
  } catch (e) {
    console.error("Error loading total outlay:", e);
  }
  
  loadApplications()

  pollingInterval = setInterval(() => {
    loadApplications()
  }, 5000)
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})

const loadApplications = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      pendingApplications.value = data.loans.map(loan => ({
        id: loan.loanReqId,
        loanReqId: loan.loanReqId,
        name: loan.name || loan.userId,
        email: loan.email || '',
        age: loan.age || '',
        type: loan.type || 'Personal Loan',
        amount: loan.amount,
        status: loan.status,
        documents: loan.documents || {}
      }));
    } else {
      console.error("Failed to load pending applications from server");
    }
  } catch (e) {
    console.error("Error loading pending applications:", e);
  }
}

const formatAmount = (amount) => {
  return '$' + Math.floor(Number(amount || 0)).toString()
}

const handleLogout = () => {
  localStorage.removeItem('user-role')
  localStorage.removeItem('user-email')
  router.push('/')
}
const goToTransactions = () => {
  router.push('/admin/transactions')
}

const approveApplication = async (application) => {
  const token = localStorage.getItem('token');
  try {
    if (application.loanReqId) {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loan/${application.loanReqId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error("Failed to update on backend: " + (err.error || "Unknown error"));
        return;
      }
    }

    totalOutlay.value -= Number(application.amount)
    
    toast.success(`Application approved for ${application.name} (${formatAmount(application.amount)})`)
    loadApplications()
  } catch (e) {
    toast.error("Connection error with backend: " + e.message);
  }
}

const rejectApplication = async (application) => {
  if (confirm(`Are you sure you want to reject ${application.name}'s loan request?`)) {
    const token = localStorage.getItem('token');
    try {
      if (application.loanReqId) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loan/${application.loanReqId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'REJECTED' })
        });
        if (!res.ok) {
          const err = await res.json();
          toast.error("Failed to update on backend: " + (err.error || "Unknown error"));
          return;
        }
      }

      toast.success(`Application rejected for ${application.name}`)
      loadApplications()
    } catch (e) {
      toast.error("Connection error with backend: " + e.message);
    }
  }
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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.transactions-btn {
  padding: 8px 16px;
  background-color: var(--primary);
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(97, 59, 155, 0.1);
  transition: all 0.2s ease;
}

.transactions-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #fff;
  padding: 24px;
  border-radius: var(--border-radius);
  border: 1px solid var(--input-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-main);
}

.applications-section h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  margin-bottom: 16px;
}

.table-container {
  background-color: #fff;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.applications-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.applications-table th {
  background-color: #f9fafb;
  padding: 16px 20px;
  font-weight: 600;
  color: var(--text-muted);
  border-bottom: 1px solid var(--input-border);
}

.applications-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--input-border);
  vertical-align: middle;
}

.applications-table tr:last-child td {
  border-bottom: none;
}

.applicant-name {
  font-weight: 600;
  color: var(--text-main);
}

.applicant-email {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.bold-text {
  font-weight: 600;
  color: var(--text-main);
}

.actions-col {
  text-align: right;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
}

.action-btn {
  padding: 8px 12px;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s ease;
}

.action-btn:hover {
  opacity: 0.9;
}

.action-btn.approve {
  background-color: var(--primary);
  color: #fff;
}

.action-btn.reject {
  background-color: #f3f4f6;
  color: var(--text-main);
  border: 1px solid var(--input-border);
}

.empty-state {
  background-color: #fff;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
}

</style>
