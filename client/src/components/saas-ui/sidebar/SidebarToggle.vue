<template>
  <button
    class="sidebar-toggle"
    @click="toggleSidebar"
    :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    :aria-expanded="!isCollapsed"
  >
    <svg
      class="toggle-icon"
      :class="{ rotated: isCollapsed }"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 5L7.5 10L12.5 15"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script setup>
import { useSidebar } from '../../../composables/useSidebar'

const { isCollapsed, toggleSidebar } = useSidebar()
</script>

<style scoped>
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--saas-radius-md);
  background: transparent;
  color: var(--saas-sidebar-text-muted);
  cursor: pointer;
  transition: var(--saas-transition-fast);
}

.sidebar-toggle:hover {
  background: var(--saas-sidebar-hover);
  color: var(--saas-sidebar-text-hover);
}

.sidebar-toggle:focus {
  outline: 2px solid var(--saas-nav-active);
  outline-offset: 2px;
}

.toggle-icon {
  transition: transform var(--saas-transition-base) var(--saas-easing-in-out);
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}
</style>
