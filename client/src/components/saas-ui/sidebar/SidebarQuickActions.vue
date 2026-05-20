<template>
  <div v-if="!isCollapsed && actions.length > 0" class="sidebar-quick-actions">
    <h3 v-if="title" class="quick-actions-title">{{ title }}</h3>
    <div class="quick-actions-list">
      <component
        :is="action.route ? 'router-link' : 'button'"
        v-for="action in actions"
        :key="action.id"
        :to="action.route"
        class="quick-action"
        :aria-label="action.label"
        @click="handleActionClick(action)"
      >
        <span v-if="action.icon" class="quick-action-icon" v-html="action.icon"></span>
        <span class="quick-action-label">{{ action.label }}</span>
        <span v-if="action.badge" class="quick-action-badge">{{ action.badge }}</span>
      </component>
    </div>
  </div>
</template>

<script setup>
import { useSidebar } from '../../../composables/useSidebar'

const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Quick Actions'
  }
})

const emit = defineEmits(['action-click'])

const { isCollapsed } = useSidebar()

const handleActionClick = (action) => {
  if (!action.route) {
    emit('action-click', action)
  }
}
</script>

<style scoped>
.sidebar-quick-actions {
  padding: var(--saas-spacing-md);
  border-top: 1px solid var(--saas-sidebar-border);
}

.quick-actions-title {
  color: var(--saas-sidebar-text-muted);
  font-size: var(--saas-text-xs);
  font-weight: var(--saas-font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--saas-spacing-sm);
}

.quick-actions-list {
  display: flex;
  flex-direction: column;
  gap: var(--saas-spacing-xs);
}

.quick-action {
  display: flex;
  align-items: center;
  gap: var(--saas-spacing-sm);
  padding: var(--saas-spacing-sm) var(--saas-spacing-md);
  width: 100%;
  border: none;
  border-radius: var(--saas-radius-md);
  background: transparent;
  color: var(--saas-sidebar-text);
  font-size: var(--saas-text-sm);
  font-weight: var(--saas-font-medium);
  text-decoration: none;
  cursor: pointer;
  transition: var(--saas-transition-fast);
}

.quick-action:hover {
  background: var(--saas-sidebar-hover);
  color: var(--saas-sidebar-text-hover);
}

.quick-action:focus {
  outline: 2px solid var(--saas-nav-active);
  outline-offset: 2px;
}

.quick-action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.quick-action-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.quick-action-label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-action-badge {
  padding: 2px 8px;
  background: var(--saas-error);
  color: white;
  font-size: var(--saas-text-xs);
  font-weight: var(--saas-font-semibold);
  border-radius: var(--saas-radius-full);
  flex-shrink: 0;
}
</style>
