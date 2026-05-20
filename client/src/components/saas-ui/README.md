# SaaS UI Kit

Modern, accessible sidebar navigation system built with Vue 3 Composition API.

## Features

- Collapsible sidebar with smooth animations
- Mobile-responsive with overlay mode
- Nested navigation with expand/collapse
- Global search with keyboard shortcuts
- Quick actions panel
- User profile dropdown
- Active route detection
- Keyboard accessible (ARIA compliant)
- Customizable with CSS variables
- TypeScript-ready component structure

## Quick Start

### 1. Import Components

```javascript
import { SaasSidebar } from '@/components/saas-ui'
```

### 2. Basic Usage

```vue
<template>
  <SaasSidebar
    :user="currentUser"
    :nav-items="navigationItems"
    :quick-actions="quickActionsList"
    @menu-click="handleMenuClick"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import { SaasSidebar } from '@/components/saas-ui'

const currentUser = ref({
  name: 'John Doe',
  role: 'Administrator',
  avatar: '/path/to/avatar.jpg'
})

const navigationItems = ref([
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '<svg>...</svg>',
        route: '/',
        badge: '3'
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: '<svg>...</svg>',
        route: '/inventory'
      }
    ]
  }
])

const quickActionsList = ref([
  {
    id: 'new-order',
    label: 'New Order',
    icon: '<svg>...</svg>',
    route: '/orders/new'
  }
])

const handleMenuClick = (item) => {
  console.log('Menu clicked:', item.id)
}

const handleSearch = (query) => {
  console.log('Search query:', query)
}
</script>
```

## Components

### SaasSidebar

Main sidebar container that orchestrates all child components.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | Object | `{ name: 'User', role: 'Role', avatar: null }` | User profile information |
| `navItems` | Array | `[]` | Navigation structure (see Navigation Structure) |
| `quickActions` | Array | `[]` | Quick action shortcuts |
| `userMenuItems` | Array | `[{ id: 'profile', label: 'Profile', icon: '👤' }, ...]` | User dropdown menu items |
| `showSearch` | Boolean | `true` | Show/hide search bar |
| `searchPlaceholder` | String | `'Search...'` | Search input placeholder |
| `quickActionsTitle` | String | `'Quick Actions'` | Quick actions section title |
| `ariaLabel` | String | `'Application sidebar'` | ARIA label for sidebar |
| `navAriaLabel` | String | `'Main navigation'` | ARIA label for navigation |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `menu-click` | `{ id, label, icon }` | User menu item clicked |
| `search` | `string` | Search query changed |
| `search-clear` | - | Search cleared |
| `quick-action` | `{ id, label, icon }` | Quick action clicked |

### SidebarHeader

User profile section with avatar and dropdown menu.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | Object | `{ name: 'User', role: 'Role', avatar: null }` | User information |
| `menuItems` | Array | `[...]` | Dropdown menu items |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `menu-click` | `{ id, label, icon }` | Menu item clicked |

### SidebarNav

Navigation menu wrapper that renders nav sections and items.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navItems` | Array | `[]` | Navigation structure |
| `ariaLabel` | String | `'Main navigation'` | ARIA label |

### SidebarNavItem

Recursive navigation item component with nesting support.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | Object | - | Navigation item (see structure below) |
| `level` | Number | `0` | Nesting level (auto-incremented) |

### SidebarSearch

Global search input with keyboard shortcut support.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | String | `'Search...'` | Input placeholder |
| `ariaLabel` | String | `'Global search'` | ARIA label |
| `shortcut` | String | `'⌘K'` | Keyboard shortcut display |
| `showShortcut` | Boolean | `true` | Show/hide shortcut badge |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `search` | `string` | Search query changed |
| `clear` | - | Search cleared |

**Keyboard Shortcuts:**

- `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux): Focus search input
- `Escape`: Clear search and lose focus

### SidebarQuickActions

Pinned shortcuts list for frequently used actions.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | Array | `[]` | Quick actions list |
| `title` | String | `'Quick Actions'` | Section title |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `action-click` | `{ id, label, icon }` | Action clicked (if no route) |

### SidebarToggle

Collapse/expand button with animated arrow icon.

No props or events - uses `useSidebar()` composable directly.

## Navigation Structure

Navigation items follow this structure:

```javascript
const navItems = [
  {
    id: 'section-1',           // Unique section ID
    title: 'Main',             // Section title (optional)
    items: [
      {
        id: 'dashboard',       // Unique item ID
        label: 'Dashboard',    // Display text
        icon: '<svg>...</svg>', // SVG icon (HTML string)
        route: '/',            // Vue Router route (optional)
        badge: '5',            // Badge text (optional)
        children: [            // Nested items (optional)
          {
            id: 'analytics',
            label: 'Analytics',
            icon: '<svg>...</svg>',
            route: '/dashboard/analytics'
          }
        ]
      }
    ]
  }
]
```

**Navigation Item Properties:**

- `id` (required): Unique identifier
- `label` (required): Display text
- `icon` (optional): SVG HTML string
- `route` (optional): Vue Router path (creates router-link)
- `badge` (optional): Badge text/number
- `children` (optional): Array of nested items (recursive)

## useSidebar Composable

Shared state management for sidebar behavior.

```javascript
import { useSidebar } from '@/components/saas-ui'

const {
  isCollapsed,           // ref<boolean> - Sidebar collapsed state
  isMobile,              // ref<boolean> - Mobile breakpoint detected
  sidebarOpen,           // ref<boolean> - Mobile sidebar open state
  expandedGroups,        // ref<Set> - Set of expanded nav group IDs
  
  toggleSidebar,         // () => void - Toggle collapsed state
  collapseSidebar,       // () => void - Collapse sidebar
  expandSidebar,         // () => void - Expand sidebar
  openMobileSidebar,     // () => void - Open mobile overlay
  closeMobileSidebar,    // () => void - Close mobile overlay
  toggleMobileSidebar,   // () => void - Toggle mobile overlay
  toggleNavGroup,        // (groupId: string) => void - Toggle nav group
  isNavGroupExpanded,    // (groupId: string) => boolean - Check if group expanded
  checkMobile,           // () => void - Check window width
  persistState,          // () => void - Save to localStorage
  restoreState           // () => void - Load from localStorage
} = useSidebar()
```

**State Persistence:**

Sidebar collapsed state is automatically persisted to `localStorage` under the key `saas-sidebar-collapsed`.

**Mobile Breakpoint:**

Mobile mode is triggered when `window.innerWidth < 1024px`.

## Customization

### CSS Variables

All styling uses CSS custom properties from `saas-ui-design-tokens.css`:

```css
:root {
  /* Sidebar colors */
  --saas-sidebar-bg: #0f172a;
  --saas-sidebar-border: #334155;
  --saas-sidebar-hover: #1e293b;
  --saas-sidebar-active-bg: #1e3a5f;
  --saas-sidebar-text: #e2e8f0;
  --saas-sidebar-text-muted: #94a3b8;
  --saas-sidebar-text-hover: #f1f5f9;
  
  /* Navigation active state */
  --saas-nav-active: #2563eb;
  --saas-nav-active-bg: #eff6ff;
  --saas-nav-active-hover: #1d4ed8;
  
  /* Dimensions */
  --saas-sidebar-width-expanded: 280px;
  --saas-sidebar-width-collapsed: 72px;
  --saas-sidebar-transition-duration: 0.3s;
  
  /* Spacing */
  --saas-spacing-xs: 0.5rem;
  --saas-spacing-sm: 0.75rem;
  --saas-spacing-md: 1rem;
  --saas-spacing-lg: 1.5rem;
  
  /* Typography */
  --saas-text-xs: 0.75rem;
  --saas-text-sm: 0.875rem;
  --saas-text-base: 1rem;
  --saas-font-medium: 500;
  --saas-font-semibold: 600;
  
  /* Border radius */
  --saas-radius-sm: 6px;
  --saas-radius-md: 8px;
  --saas-radius-full: 9999px;
  
  /* Z-index */
  --saas-z-fixed: 500;
  --saas-z-dropdown: 1000;
  --saas-z-modal-backdrop: 1040;
  --saas-z-modal: 1050;
}
```

### Theming Example

Override variables to customize appearance:

```css
:root {
  /* Custom brand colors */
  --saas-sidebar-bg: #1a1a2e;
  --saas-nav-active: #ff6b6b;
  --saas-sidebar-width-expanded: 320px;
}
```

### Icon System

Icons are provided as HTML strings (SVG). Recommended icon sources:

- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)
- [Feather Icons](https://feathericons.com/)

**Example Icon Helper:**

```javascript
const icons = {
  dashboard: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" 
            stroke="currentColor" stroke-width="2"/>
    </svg>
  `,
  inventory: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" 
            stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}
```

## Responsive Behavior

### Desktop (>1024px)

- Sidebar is fixed position on the left
- Can be collapsed to icon-only mode
- State persists across page reloads
- Width transitions smoothly

### Tablet/Mobile (<1024px)

- Sidebar is hidden by default
- Opens as overlay when triggered
- Full-width on small screens
- Backdrop overlay prevents interaction with main content
- Automatically closes when navigating

### Trigger Mobile Sidebar

```vue
<template>
  <button @click="openMobileSidebar">Open Menu</button>
</template>

<script setup>
import { useSidebar } from '@/components/saas-ui'

const { openMobileSidebar } = useSidebar()
</script>
```

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- Semantic HTML elements (`<nav>`, `<button>`, `<aside>`)
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader announcements
- Proper heading hierarchy

**Keyboard Navigation:**

- `Tab`: Move focus through interactive elements
- `Enter`/`Space`: Activate buttons and links
- `Escape`: Close dropdowns and clear search
- `Cmd+K`/`Ctrl+K`: Focus search input
- Arrow keys: Expand/collapse nested navigation (future enhancement)

## Complete Example

```vue
<template>
  <div class="app-layout">
    <SaasSidebar
      :user="currentUser"
      :nav-items="navigation"
      :quick-actions="quickActions"
      :user-menu-items="userMenu"
      @menu-click="handleUserMenu"
      @search="handleSearch"
      @quick-action="handleQuickAction"
    />
    
    <main class="app-content">
      <button class="mobile-menu-btn" @click="openMobileSidebar">
        Menu
      </button>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { SaasSidebar, useSidebar } from '@/components/saas-ui'

const router = useRouter()
const { openMobileSidebar } = useSidebar()

const currentUser = ref({
  name: 'Sarah Johnson',
  role: 'Operations Manager',
  avatar: '/images/avatar.jpg'
})

const navigation = ref([
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        route: '/'
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 6L10 3L17 6V14L10 17L3 14V6Z" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        route: '/inventory',
        badge: '12'
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M7 10L9 12L13 8" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        children: [
          {
            id: 'pending-orders',
            label: 'Pending',
            route: '/orders/pending',
            badge: '5'
          },
          {
            id: 'completed-orders',
            label: 'Completed',
            route: '/orders/completed'
          }
        ]
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 17V12M10 17V7M17 17V3" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        route: '/reports'
      }
    ]
  }
])

const quickActions = ref([
  {
    id: 'new-order',
    label: 'New Order',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    route: '/orders/new'
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L3 17H17L10 3Z" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    badge: '3'
  }
])

const userMenu = ref([
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'help', label: 'Help', icon: '❓' },
  { id: 'logout', label: 'Logout', icon: '🚪' }
])

const handleUserMenu = (item) => {
  if (item.id === 'logout') {
    console.log('Logging out...')
  } else if (item.id === 'profile') {
    router.push('/profile')
  }
}

const handleSearch = (query) => {
  console.log('Search:', query)
  // Implement search functionality
}

const handleQuickAction = (action) => {
  console.log('Quick action:', action.id)
  // Handle non-route actions
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-content {
  flex: 1;
  margin-left: var(--saas-sidebar-width-expanded);
  transition: margin-left var(--saas-sidebar-transition-duration);
  background: var(--saas-content-bg);
}

/* When sidebar is collapsed */
.app-content {
  margin-left: var(--saas-sidebar-width-collapsed);
}

/* Mobile: no margin */
@media (max-width: 1024px) {
  .app-content {
    margin-left: 0;
  }
}

.mobile-menu-btn {
  display: none;
  padding: 0.5rem 1rem;
  margin: 1rem;
}

@media (max-width: 1024px) {
  .mobile-menu-btn {
    display: block;
  }
}
</style>
```

## Best Practices

### Navigation Structure

1. Keep navigation hierarchy shallow (max 2-3 levels)
2. Use clear, concise labels
3. Group related items in sections
4. Limit sections to 5-7 items for optimal UX
5. Use badges sparingly for important notifications

### Icons

1. Use consistent icon style (outline vs. filled)
2. Keep icon size uniform (20x20px recommended)
3. Use `currentColor` for stroke/fill to inherit text color
4. Optimize SVG code (remove unnecessary attributes)

### Performance

1. Lazy-load icons if using many (>50 items)
2. Use `v-show` instead of `v-if` for frequently toggled sections
3. Debounce search input for API calls
4. Memoize computed navigation structures

### Accessibility

1. Provide meaningful ARIA labels
2. Ensure keyboard navigation works
3. Test with screen readers
4. Maintain focus indicators
5. Use semantic HTML

## Troubleshooting

### Sidebar not showing

- Check z-index conflicts with other fixed elements
- Verify design tokens CSS is imported
- Ensure useSidebar composable is initialized

### Active state not working

- Verify routes match exactly (including trailing slashes)
- Check route configuration in main.js
- Use Vue DevTools to inspect route.path

### Icons not displaying

- Ensure SVG strings are valid HTML
- Check for escaped quotes in icon strings
- Verify icon viewBox dimensions

### Mobile overlay not closing

- Check for event.stopPropagation() preventing clicks
- Verify overlay z-index is below sidebar
- Ensure closeMobileSidebar is called on navigation

### Collapsed state not persisting

- Check localStorage is available
- Verify key name matches: 'saas-sidebar-collapsed'
- Check browser privacy settings

## Contributing

When contributing new components:

1. Follow Vue 3 Composition API patterns
2. Use `<script setup>` syntax
3. Add TypeScript props validation
4. Include ARIA attributes
5. Use design tokens (no hardcoded colors)
6. Test responsive behavior
7. Document props and events
8. Add usage examples

## License

MIT License - see project root for details.
