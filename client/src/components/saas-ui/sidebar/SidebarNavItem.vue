<template>
  <div class="nav-item-wrapper">
    <component
      :is="item.route ? 'router-link' : 'button'"
      :to="item.route"
      class="nav-item"
      :class="{
        'nav-item-active': isActive,
        'nav-item-collapsed': isCollapsed,
        'nav-item-has-children': hasChildren
      }"
      :aria-label="item.label"
      :aria-current="isActive ? 'page' : undefined"
      @click="handleClick"
    >
      <span v-if="item.icon" class="nav-item-icon" v-html="item.icon"></span>
      <span v-if="!isCollapsed" class="nav-item-label">{{ item.label }}</span>
      <span v-if="!isCollapsed && item.badge" class="nav-item-badge">{{ item.badge }}</span>
      <span
        v-if="!isCollapsed && hasChildren"
        class="nav-item-arrow"
        :class="{ 'nav-item-arrow-expanded': isExpanded }"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </component>

    <!-- Recursive children rendering -->
    <div
      v-if="hasChildren && isExpanded && !isCollapsed"
      class="nav-item-children"
    >
      <SidebarNavItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSidebar } from '../../../composables/useSidebar'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const route = useRoute()
const { isCollapsed, toggleNavGroup, isNavGroupExpanded } = useSidebar()

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

const isExpanded = computed(() => {
  return isNavGroupExpanded(props.item.id)
})

const isActive = computed(() => {
  if (!props.item.route) return false

  // Check if current route matches this item's route
  if (route.path === props.item.route) return true

  // Check if any child route is active
  if (hasChildren.value) {
    return props.item.children.some(child => {
      if (child.route === route.path) return true
      // Recursively check nested children
      if (child.children) {
        return checkChildrenActive(child.children)
      }
      return false
    })
  }

  return false
})

const checkChildrenActive = (children) => {
  return children.some(child => {
    if (child.route === route.path) return true
    if (child.children) {
      return checkChildrenActive(child.children)
    }
    return false
  })
}

const handleClick = (event) => {
  if (hasChildren.value) {
    event.preventDefault()
    toggleNavGroup(props.item.id)
  }
}
</script>

<style scoped>
.nav-item-wrapper {
  margin-bottom: var(--saas-spacing-xs);
}

.nav-item {
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
  position: relative;
}

.nav-item:hover {
  background: var(--saas-sidebar-hover);
  color: var(--saas-sidebar-text-hover);
}

.nav-item:focus {
  outline: 2px solid var(--saas-nav-active);
  outline-offset: 2px;
}

.nav-item-active {
  background: var(--saas-sidebar-active-bg);
  color: var(--saas-sidebar-text-hover);
}

.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--saas-nav-active);
  border-radius: 0 2px 2px 0;
}

.nav-item-collapsed {
  justify-content: center;
  padding: var(--saas-spacing-sm);
}

.nav-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-item-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.nav-item-label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item-badge {
  padding: 2px 8px;
  background: var(--saas-nav-active);
  color: white;
  font-size: var(--saas-text-xs);
  font-weight: var(--saas-font-semibold);
  border-radius: var(--saas-radius-full);
  flex-shrink: 0;
}

.nav-item-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--saas-transition-base) var(--saas-easing-in-out);
  flex-shrink: 0;
}

.nav-item-arrow-expanded {
  transform: rotate(90deg);
}

.nav-item-children {
  margin-left: var(--saas-spacing-lg);
  margin-top: var(--saas-spacing-xs);
  padding-left: var(--saas-spacing-sm);
  border-left: 1px solid var(--saas-sidebar-border);
}
</style>
