<template>
  <div v-if="!isCollapsed" class="sidebar-search">
    <div class="search-input-wrapper">
      <span class="search-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle
            cx="7"
            cy="7"
            r="5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M11 11L15 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <span v-if="showShortcut" class="search-shortcut">{{ shortcut }}</span>
      <button
        v-if="searchQuery"
        class="search-clear"
        @click="clearSearch"
        aria-label="Clear search"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 3L11 11M11 3L3 11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSidebar } from '../../../composables/useSidebar'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search...'
  },
  ariaLabel: {
    type: String,
    default: 'Global search'
  },
  shortcut: {
    type: String,
    default: '⌘K'
  },
  showShortcut: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['search', 'clear'])

const { isCollapsed } = useSidebar()
const searchInput = ref(null)
const searchQuery = ref('')

const handleInput = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
  searchInput.value?.focus()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    clearSearch()
  }
}

const handleGlobalShortcut = (event) => {
  // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalShortcut)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalShortcut)
})
</script>

<style scoped>
.sidebar-search {
  padding: var(--saas-spacing-md);
  padding-top: var(--saas-spacing-sm);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--saas-spacing-sm);
  color: var(--saas-sidebar-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--saas-spacing-sm) var(--saas-spacing-md);
  padding-left: calc(var(--saas-spacing-md) + 24px);
  padding-right: calc(var(--saas-spacing-md) + 60px);
  background: var(--saas-sidebar-hover);
  border: 1px solid var(--saas-sidebar-border);
  border-radius: var(--saas-radius-md);
  color: var(--saas-sidebar-text);
  font-size: var(--saas-text-sm);
  font-family: var(--saas-font-family);
  transition: var(--saas-transition-fast);
}

.search-input::placeholder {
  color: var(--saas-sidebar-text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--saas-nav-active);
  background: var(--saas-sidebar-bg);
}

.search-shortcut {
  position: absolute;
  right: var(--saas-spacing-sm);
  padding: 2px 6px;
  background: var(--saas-sidebar-border);
  color: var(--saas-sidebar-text-muted);
  font-size: var(--saas-text-xs);
  font-weight: var(--saas-font-medium);
  border-radius: var(--saas-radius-sm);
  pointer-events: none;
}

.search-clear {
  position: absolute;
  right: var(--saas-spacing-sm);
  padding: 4px;
  background: transparent;
  border: none;
  color: var(--saas-sidebar-text-muted);
  cursor: pointer;
  border-radius: var(--saas-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--saas-transition-fast);
}

.search-clear:hover {
  background: var(--saas-sidebar-hover);
  color: var(--saas-sidebar-text-hover);
}

.search-clear:focus {
  outline: 2px solid var(--saas-nav-active);
  outline-offset: 2px;
}
</style>
