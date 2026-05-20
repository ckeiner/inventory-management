<template>
  <aside
    class="saas-sidebar"
    :class="{
      'saas-sidebar-collapsed': isCollapsed,
      'saas-sidebar-open': isMobile && sidebarOpen
    }"
    :aria-label="ariaLabel"
  >
    <!-- Mobile overlay backdrop -->
    <div
      v-if="isMobile && sidebarOpen"
      class="sidebar-overlay"
      @click="closeMobileSidebar"
    ></div>

    <!-- Sidebar content -->
    <div class="sidebar-content">
      <!-- Header section with user profile -->
      <SidebarHeader
        :user="user"
        :menu-items="userMenuItems"
        @menu-click="handleMenuClick"
      />

      <!-- Search section -->
      <SidebarSearch
        v-if="showSearch"
        :placeholder="searchPlaceholder"
        @search="handleSearch"
        @clear="handleSearchClear"
      />

      <!-- Navigation section -->
      <SidebarNav
        :nav-items="navItems"
        :aria-label="navAriaLabel"
      />

      <!-- Quick actions section -->
      <SidebarQuickActions
        v-if="quickActions.length > 0"
        :actions="quickActions"
        :title="quickActionsTitle"
        @action-click="handleQuickAction"
      />

      <!-- Toggle button section -->
      <div class="sidebar-footer">
        <SidebarToggle />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useSidebar } from '../../../composables/useSidebar'
import SidebarHeader from './SidebarHeader.vue'
import SidebarSearch from './SidebarSearch.vue'
import SidebarNav from './SidebarNav.vue'
import SidebarQuickActions from './SidebarQuickActions.vue'
import SidebarToggle from './SidebarToggle.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      name: 'User',
      role: 'Role',
      avatar: null
    })
  },
  navItems: {
    type: Array,
    required: true,
    default: () => []
  },
  quickActions: {
    type: Array,
    default: () => []
  },
  userMenuItems: {
    type: Array,
    default: () => [
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'logout', label: 'Logout', icon: '🚪' }
    ]
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  quickActionsTitle: {
    type: String,
    default: 'Quick Actions'
  },
  ariaLabel: {
    type: String,
    default: 'Application sidebar'
  },
  navAriaLabel: {
    type: String,
    default: 'Main navigation'
  }
})

const emit = defineEmits(['menu-click', 'search', 'search-clear', 'quick-action'])

const {
  isCollapsed,
  isMobile,
  sidebarOpen,
  closeMobileSidebar,
  checkMobile
} = useSidebar()

const handleMenuClick = (item) => {
  emit('menu-click', item)
}

const handleSearch = (query) => {
  emit('search', query)
}

const handleSearchClear = () => {
  emit('search-clear')
}

const handleQuickAction = (action) => {
  emit('quick-action', action)
}

// Handle window resize
onMounted(() => {
  window.addEventListener('resize', checkMobile)
  checkMobile()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.saas-sidebar {
  position: relative;
  width: var(--saas-sidebar-width-expanded);
  height: 100%;
  background: var(--saas-sidebar-bg);
  border-right: 1px solid var(--saas-sidebar-border);
  transition: width var(--saas-sidebar-transition-duration) var(--saas-easing-in-out);
  z-index: var(--saas-z-fixed);
}

.saas-sidebar-collapsed {
  width: var(--saas-sidebar-width-collapsed);
}

/* Mobile styles */
@media (max-width: 1024px) {
  .saas-sidebar {
    transform: translateX(-100%);
    transition: transform var(--saas-sidebar-transition-duration) var(--saas-easing-in-out);
    z-index: var(--saas-z-modal);
  }

  .saas-sidebar-open {
    transform: translateX(0);
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--saas-z-modal-backdrop);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-footer {
  padding: var(--saas-spacing-md);
  border-top: 1px solid var(--saas-sidebar-border);
  display: flex;
  justify-content: flex-end;
}

.saas-sidebar-collapsed .sidebar-footer {
  justify-content: center;
}
</style>
