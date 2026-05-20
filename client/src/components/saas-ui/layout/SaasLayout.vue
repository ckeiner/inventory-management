<template>
  <div class="saas-layout" :class="{ 'sidebar-collapsed': isCollapsed, 'sidebar-overlay': isMobile }">
    <SaasSidebar
      :logo="logo"
      :app-name="appName"
      :user="user"
      :nav-items="navItems"
      :quick-actions="quickActions"
      :user-menu-items="userMenuItems"
      :search-enabled="searchEnabled"
      @search="$emit('search', $event)"
      @menu-click="$emit('menu-click', $event)"
    />

    <div v-if="isMobile && sidebarOpen" class="saas-overlay" @click="closeMobileSidebar"></div>

    <SaasContent>
      <slot />
    </SaasContent>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSidebar } from '../../../composables/useSidebar'
import SaasSidebar from '../sidebar/SaasSidebar.vue'
import SaasContent from './SaasContent.vue'

const props = defineProps({
  logo: {
    type: String,
    default: null
  },
  appName: {
    type: String,
    default: 'SaaS App'
  },
  user: {
    type: Object,
    default: () => ({
      name: 'User',
      avatar: null,
      role: 'Member'
    })
  },
  navItems: {
    type: Array,
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
  searchEnabled: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['search', 'menu-click'])

const { isCollapsed, isMobile, sidebarOpen, toggleSidebar, closeMobileSidebar, checkMobile } = useSidebar()

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.saas-layout {
  display: grid;
  grid-template-columns: var(--saas-sidebar-width-expanded) 1fr;
  height: 100vh;
  background-color: var(--saas-content-bg);
  transition: grid-template-columns var(--saas-sidebar-transition-duration) var(--saas-easing-in-out);
}

.saas-layout.sidebar-collapsed {
  grid-template-columns: var(--saas-sidebar-width-collapsed) 1fr;
}

.saas-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--saas-z-modal-backdrop);
}

/* Mobile responsive - sidebar becomes overlay */
@media (max-width: 1024px) {
  .saas-layout.sidebar-overlay {
    grid-template-columns: 1fr;
  }

  .saas-layout.sidebar-overlay > :first-child {
    position: fixed;
    inset: 0;
    z-index: var(--saas-z-modal);
  }
}

@media (max-width: 768px) {
  .saas-layout {
    grid-template-columns: 1fr;
  }

  .saas-layout.sidebar-overlay > :first-child {
    position: fixed;
    inset: 0;
    width: var(--saas-sidebar-width-expanded);
    z-index: var(--saas-z-modal);
  }
}
</style>
