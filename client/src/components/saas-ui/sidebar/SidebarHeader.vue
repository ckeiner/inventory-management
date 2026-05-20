<template>
  <div class="sidebar-header">
    <div class="user-profile">
      <div class="avatar">
        <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
        <span v-else class="avatar-initials">{{ initials }}</span>
      </div>
      <div v-if="!isCollapsed" class="user-info">
        <div class="user-name">{{ user.name }}</div>
        <div class="user-role">{{ user.role }}</div>
      </div>
    </div>
    <div v-if="!isCollapsed" class="header-actions">
      <button
        class="dropdown-toggle"
        @click="toggleDropdown"
        :aria-label="'User menu for ' + user.name"
        :aria-expanded="dropdownOpen"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div v-if="dropdownOpen" class="dropdown-menu" @click.stop>
        <a
          v-for="item in menuItems"
          :key="item.id"
          href="#"
          class="dropdown-item"
          @click.prevent="handleMenuClick(item)"
        >
          <span class="dropdown-item-icon">{{ item.icon }}</span>
          <span class="dropdown-item-label">{{ item.label }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSidebar } from '../../../composables/useSidebar'

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
  menuItems: {
    type: Array,
    default: () => [
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'logout', label: 'Logout', icon: '🚪' }
    ]
  }
})

const emit = defineEmits(['menu-click'])

const { isCollapsed } = useSidebar()
const dropdownOpen = ref(false)

const initials = computed(() => {
  const names = props.user.name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return names[0][0]
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleMenuClick = (item) => {
  emit('menu-click', item)
  dropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownOpen.value && !event.target.closest('.sidebar-header')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.sidebar-header {
  padding: var(--saas-spacing-lg);
  border-bottom: 1px solid var(--saas-sidebar-border);
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--saas-spacing-sm);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--saas-radius-full);
  background: var(--saas-nav-active);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: white;
  font-weight: var(--saas-font-semibold);
  font-size: var(--saas-text-sm);
  text-transform: uppercase;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  color: var(--saas-sidebar-text);
  font-weight: var(--saas-font-semibold);
  font-size: var(--saas-text-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  color: var(--saas-sidebar-text-muted);
  font-size: var(--saas-text-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  position: relative;
}

.dropdown-toggle {
  padding: var(--saas-spacing-xs);
  border: none;
  background: transparent;
  color: var(--saas-sidebar-text-muted);
  cursor: pointer;
  border-radius: var(--saas-radius-sm);
  transition: var(--saas-transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-toggle:hover {
  background: var(--saas-sidebar-hover);
  color: var(--saas-sidebar-text-hover);
}

.dropdown-toggle:focus {
  outline: 2px solid var(--saas-nav-active);
  outline-offset: 2px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--saas-card-bg);
  border: 1px solid var(--saas-border-light);
  border-radius: var(--saas-radius-md);
  box-shadow: var(--saas-dropdown-shadow);
  padding: var(--saas-spacing-xs);
  z-index: var(--saas-z-dropdown);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--saas-spacing-sm);
  padding: var(--saas-spacing-sm) var(--saas-spacing-md);
  color: var(--saas-text-primary);
  text-decoration: none;
  border-radius: var(--saas-radius-sm);
  font-size: var(--saas-text-sm);
  transition: var(--saas-transition-fast);
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--saas-card-hover-bg);
}

.dropdown-item-icon {
  font-size: var(--saas-text-base);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}

.dropdown-item-label {
  flex: 1;
}
</style>
