import { ref, onMounted, onUnmounted } from 'vue'

// Module-level refs (singleton pattern)
const isCollapsed = ref(localStorage.getItem('saas-sidebar-collapsed') === 'true')
const isMobile = ref(window.innerWidth < 1024)
const sidebarOpen = ref(false)
const expandedGroups = ref(new Set())

export function useSidebar() {
  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
    persistState()
  }

  // Explicitly collapse sidebar
  const collapseSidebar = () => {
    isCollapsed.value = true
    persistState()
  }

  // Explicitly expand sidebar
  const expandSidebar = () => {
    isCollapsed.value = false
    persistState()
  }

  // Open mobile sidebar overlay
  const openMobileSidebar = () => {
    if (isMobile.value) {
      sidebarOpen.value = true
    }
  }

  // Close mobile sidebar overlay
  const closeMobileSidebar = () => {
    sidebarOpen.value = false
  }

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    if (isMobile.value) {
      sidebarOpen.value = !sidebarOpen.value
    }
  }

  // Toggle expansion of a navigation group
  const toggleNavGroup = (groupId) => {
    if (expandedGroups.value.has(groupId)) {
      expandedGroups.value.delete(groupId)
    } else {
      expandedGroups.value.add(groupId)
    }
  }

  // Check if a nav group is expanded
  const isNavGroupExpanded = (groupId) => {
    return expandedGroups.value.has(groupId)
  }

  // Check responsive breakpoint and update mobile flag
  const checkMobile = () => {
    const wasMobile = isMobile.value
    isMobile.value = window.innerWidth < 1024

    if (!isMobile.value && wasMobile) {
      sidebarOpen.value = false
    }
  }

  // Persist sidebar state to localStorage
  const persistState = () => {
    localStorage.setItem('saas-sidebar-collapsed', isCollapsed.value)
  }

  // Restore sidebar state from localStorage
  const restoreState = () => {
    const saved = localStorage.getItem('saas-sidebar-collapsed')
    if (saved !== null) {
      isCollapsed.value = saved === 'true'
    }
  }

  return {
    isCollapsed,
    isMobile,
    sidebarOpen,
    expandedGroups,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
    toggleNavGroup,
    isNavGroupExpanded,
    checkMobile,
    persistState,
    restoreState
  }
}
