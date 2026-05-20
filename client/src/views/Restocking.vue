<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Budget Slider Card -->
      <div class="card budget-card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.setBudget') }}</h3>
        </div>
        <div class="budget-controls">
          <div class="budget-slider-container">
            <input
              type="range"
              v-model.number="budget"
              :min="minBudget"
              :max="maxBudget"
              :step="budgetStep"
              class="budget-slider"
            />
            <div class="budget-display">
              <span class="budget-label">{{ t('restocking.availableBudget') }}:</span>
              <span class="budget-value">{{ currencySymbol }}{{ budget.toLocaleString() }}</span>
            </div>
          </div>
          <button @click="generateRecommendations" class="btn-primary">
            {{ t('restocking.generateRecommendations') }}
          </button>
        </div>
      </div>

      <!-- Recommendations Section -->
      <div v-if="recommendations.length > 0" class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.recommendations') }}</h3>
          <span class="recommendation-count">{{ recommendations.length }} {{ t('restocking.items') }}</span>
        </div>

        <div class="table-container">
          <table class="recommendations-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.itemName') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.forecastedDemand') }}</th>
                <th>{{ t('restocking.table.quantity') }}</th>
                <th>{{ t('restocking.table.unitPrice') }}</th>
                <th>{{ t('restocking.table.subtotal') }}</th>
                <th>{{ t('restocking.table.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in recommendations" :key="item.sku">
                <td><strong>{{ item.sku }}</strong></td>
                <td>{{ translateProductName(item.name) }}</td>
                <td>
                  <span :class="['badge', item.trend]">
                    {{ t(`trends.${item.trend}`) }}
                  </span>
                </td>
                <td>{{ item.forecasted_demand }}</td>
                <td>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    :min="1"
                    :max="item.forecasted_demand"
                    class="quantity-input"
                  />
                </td>
                <td>{{ currencySymbol }}{{ item.unit_price.toFixed(2) }}</td>
                <td><strong>{{ currencySymbol }}{{ (item.quantity * item.unit_price).toFixed(2) }}</strong></td>
                <td>
                  <button @click="removeItem(index)" class="btn-remove">
                    {{ t('common.remove') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-row">
            <span class="summary-label">{{ t('restocking.totalItems') }}:</span>
            <span class="summary-value">{{ recommendations.length }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('restocking.totalCost') }}:</span>
            <span class="summary-value total-cost">{{ currencySymbol }}{{ totalCost.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('restocking.remainingBudget') }}:</span>
            <span class="summary-value" :class="{ 'over-budget': remainingBudget < 0 }">
              {{ currencySymbol }}{{ remainingBudget.toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Place Order Button -->
        <div class="order-actions">
          <button
            @click="placeOrder"
            :disabled="submitting || recommendations.length === 0 || remainingBudget < 0"
            class="btn-place-order"
          >
            {{ submitting ? t('restocking.submitting') : t('restocking.placeOrder') }}
          </button>
        </div>
      </div>

      <!-- No Recommendations Message -->
      <div v-else-if="recommendationsGenerated" class="card empty-state">
        <p>{{ t('restocking.noRecommendations') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'
import { useRouter } from 'vue-router'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency, translateProductName } = useI18n()
    const { getCurrentFilters } = useFilters()
    const router = useRouter()

    const currencySymbol = computed(() => {
      return currentCurrency.value === 'JPY' ? '¥' : '$'
    })

    const loading = ref(true)
    const error = ref(null)
    const submitting = ref(false)

    // Budget configuration
    const minBudget = ref(1000)
    const maxBudget = ref(100000)
    const budgetStep = ref(1000)
    const budget = ref(25000)

    // Data
    const demandForecasts = ref([])
    const inventoryItems = ref([])
    const recommendations = ref([])
    const recommendationsGenerated = ref(false)

    // Load initial data
    const loadData = async () => {
      try {
        loading.value = true
        const filters = getCurrentFilters()

        const [forecasts, inventory] = await Promise.all([
          api.getDemandForecasts(),
          api.getInventory({
            warehouse: filters.warehouse,
            category: filters.category
          })
        ])

        demandForecasts.value = forecasts
        inventoryItems.value = inventory
      } catch (err) {
        error.value = 'Failed to load data: ' + err.message
      } finally {
        loading.value = false
      }
    }

    // Recommendation algorithm - prioritize increasing trend items
    const generateRecommendations = () => {
      recommendations.value = []
      recommendationsGenerated.value = true

      // Create SKU map for inventory lookup
      const inventoryMap = {}
      inventoryItems.value.forEach(item => {
        inventoryMap[item.sku] = item
      })

      // Sort by trend priority: increasing > stable > decreasing
      const trendPriority = { 'increasing': 1, 'stable': 2, 'decreasing': 3 }
      const sortedForecasts = [...demandForecasts.value].sort((a, b) => {
        return trendPriority[a.trend] - trendPriority[b.trend]
      })

      let remainingBudget = budget.value
      const selectedItems = []

      // Greedily select items that fit within budget
      for (const forecast of sortedForecasts) {
        const inventoryItem = inventoryMap[forecast.item_sku]

        // Skip if no inventory data (no price)
        if (!inventoryItem) continue

        const unitPrice = inventoryItem.unit_cost
        const quantity = forecast.forecasted_demand
        const cost = quantity * unitPrice

        // If this item fits in budget, add it
        if (cost <= remainingBudget) {
          selectedItems.push({
            sku: forecast.item_sku,
            name: forecast.item_name,
            trend: forecast.trend,
            forecasted_demand: forecast.forecasted_demand,
            quantity: quantity,
            unit_price: unitPrice
          })
          remainingBudget -= cost
        }
      }

      recommendations.value = selectedItems
    }

    // Calculate total cost
    const totalCost = computed(() => {
      return recommendations.value.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price)
      }, 0)
    })

    // Calculate remaining budget
    const remainingBudget = computed(() => {
      return budget.value - totalCost.value
    })

    // Remove item from recommendations
    const removeItem = (index) => {
      recommendations.value.splice(index, 1)
    }

    // Place order
    const placeOrder = async () => {
      if (recommendations.value.length === 0) return
      if (remainingBudget.value < 0) {
        error.value = 'Total cost exceeds budget'
        return
      }

      try {
        submitting.value = true
        error.value = null

        // Format items for API
        const orderItems = recommendations.value.map(item => ({
          sku: item.sku,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))

        // Create order
        const orderData = {
          customer: "Internal Restocking",
          items: orderItems,
          warehouse: "San Francisco"
        }

        await api.createOrder(orderData)

        // Navigate to orders tab
        router.push('/orders')
      } catch (err) {
        error.value = 'Failed to place order: ' + err.message
      } finally {
        submitting.value = false
      }
    }

    onMounted(loadData)

    return {
      t,
      currencySymbol,
      loading,
      error,
      submitting,
      budget,
      minBudget,
      maxBudget,
      budgetStep,
      recommendations,
      recommendationsGenerated,
      totalCost,
      remainingBudget,
      generateRecommendations,
      removeItem,
      placeOrder,
      translateProductName
    }
  }
}
</script>

<style scoped>
/* Budget Card */
.budget-card {
  margin-bottom: 1.5rem;
}

.budget-controls {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.budget-slider-container {
  flex: 1;
}

.budget-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  margin-bottom: 1rem;
}

.budget-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.budget-slider::-webkit-slider-thumb:hover {
  background: #1d4ed8;
  transform: scale(1.1);
}

.budget-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.budget-slider::-moz-range-thumb:hover {
  background: #1d4ed8;
  transform: scale(1.1);
}

.budget-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-label {
  font-size: 0.938rem;
  color: #64748b;
  font-weight: 500;
}

.budget-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.938rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #1d4ed8;
}

/* Recommendations Table */
.recommendation-count {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.recommendations-table {
  table-layout: auto;
}

.quantity-input {
  width: 80px;
  padding: 0.375rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
}

.quantity-input:focus {
  outline: none;
  border-color: #2563eb;
}

.btn-remove {
  padding: 0.375rem 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 4px;
  font-size: 0.813rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #fecaca;
}

/* Order Summary */
.order-summary {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-label {
  font-size: 0.938rem;
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.summary-value.total-cost {
  font-size: 1.25rem;
  color: #2563eb;
}

.summary-value.over-budget {
  color: #dc2626;
}

/* Order Actions */
.order-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-place-order {
  padding: 0.875rem 2rem;
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-place-order:hover:not(:disabled) {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.btn-place-order:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 1rem;
}
</style>
