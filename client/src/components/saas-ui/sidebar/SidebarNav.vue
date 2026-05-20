<template>
  <nav class="sidebar-nav" :aria-label="ariaLabel">
    <div v-for="section in navItems" :key="section.id" class="nav-section">
      <h3 v-if="section.title && !isCollapsed" class="nav-section-title">
        {{ section.title }}
      </h3>
      <div class="nav-section-items">
        <SidebarNavItem
          v-for="item in section.items"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useSidebar } from '../../../composables/useSidebar'
import SidebarNavItem from './SidebarNavItem.vue'

const props = defineProps({
  navItems: {
    type: Array,
    required: true,
    default: () => []
  },
  ariaLabel: {
    type: String,
    default: 'Main navigation'
  }
})

const { isCollapsed } = useSidebar()
</script>

<style scoped>
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--saas-spacing-md);
}

/* Custom scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--saas-sidebar-border);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: var(--saas-sidebar-text-muted);
}

.nav-section {
  margin-bottom: var(--saas-spacing-lg);
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  color: var(--saas-sidebar-text-muted);
  font-size: var(--saas-text-xs);
  font-weight: var(--saas-font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 var(--saas-spacing-md);
  margin-bottom: var(--saas-spacing-sm);
}

.nav-section-items {
  display: flex;
  flex-direction: column;
}
</style>
