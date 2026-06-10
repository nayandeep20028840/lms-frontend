<template>
  <div class="transactions-container">
    <header class="transactions-header">
      <div class="header-brand">
        <h2>Transaction History</h2>
        <p class="subtitle">Record of all approved loan payouts</p>
      </div>
      <button @click="backToDashboard" class="back-btn">Back to Dashboard</button>
    </header>

    <main class="transactions-content">
      <div class="table-container-card fade-in">
        <div class="table-header">
          <h3>Approved Transactions</h3>
          <button @click="clearHistory" class="clear-btn" v-if="transactions.length > 0">Clear History</button>
        </div>

        <div class="table-responsive" v-if="transactions.length > 0">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date & Time</th>
                <th>Recipient</th>
                <th>Amount Payout</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="txn in transactions" :key="txn.id">
                <td>
                  <span class="txn-id">{{ txn.id }}</span>
                </td>
                <td class="date-cell">{{ txn.date }}</td>
                <td>
                  <div class="recipient-name">{{ txn.applicantName }}</div>
                  <div class="recipient-email">{{ txn.applicantEmail }}</div>
                </td>
                <td class="amount-cell">{{ formatAmount(txn.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" v-else>
          <p>No transactions have been recorded yet. Approved loans will appear here.</p>
        </div>
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
const transactions = ref([])

onMounted(() => {
  loadTransactions()
})

const loadTransactions = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/completed`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();

      transactions.value = data.loans.map(loan => {
        const id = loan.loanReqId || loan.pk.split('#')[1];
        
        return {
          id: id,
          date: new Date(loan.updatedAt || loan.createdAt || Date.now()).toLocaleString(),
          applicantName: loan.name || `User ${loan.userId.substring(0, 5)}`,
          applicantEmail: loan.email || `ID: ${loan.userId}`, 
          amount: loan.amount
        }
      }).reverse();
    } else {
      console.error('Failed to fetch transactions from server');
    }
  } catch (e) {
    console.error('Error fetching transactions:', e);
  }
}

const formatAmount = (amount) => {
  return '$' + Math.floor(Number(amount || 0)).toString()
}

const backToDashboard = () => {
  router.push('/admin')
}

const clearHistory = async () => {
  if (confirm("Are you sure you want to clear all transaction history? This will not affect the outlay.")) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/history`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        transactions.value = [];
        toast.success("Transaction history cleared successfully");
      } else {
        toast.error("Failed to clear history on backend");
      }
    } catch (e) {
      toast.error("Error clearing history");
    }
  }
}
</script>

<style scoped>
.transactions-container {
  min-height: 100vh;
  background-color: #f9fafb;
  color: var(--text-main);
  font-family: var(--font-body);
}

.transactions-header {
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

.subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.back-btn {
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.transactions-content {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 24px;
}

.table-container-card {
  background-color: #fff;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  padding: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--input-border);
  padding-bottom: 16px;
}

.table-header h3 {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  color: var(--text-main);
  margin: 0;
}

.clear-btn {
  padding: 6px 12px;
  background: none;
  border: 1px solid #fecaca;
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 600;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clear-btn:hover {
  background-color: #fef2f2;
}

.table-responsive {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.transactions-table th {
  background-color: #f9fafb;
  padding: 14px 18px;
  font-weight: 600;
  color: var(--text-muted);
  border-bottom: 1px solid var(--input-border);
}

.transactions-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--input-border);
  vertical-align: middle;
}

.transactions-table tr:last-child td {
  border-bottom: none;
}

.txn-id {
  font-family: monospace;
  font-weight: 600;
  color: var(--primary);
  background-color: var(--primary-light);
  padding: 2px 6px;
  border-radius: 4px;
}

.date-cell {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.recipient-name {
  font-weight: 600;
  color: var(--text-main);
}

.recipient-email {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.amount-cell {
  font-weight: 700;
  color: #dc2626;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
}

.fade-in {
  animation: fadeIn 0.25s ease forwards;
}

</style>
