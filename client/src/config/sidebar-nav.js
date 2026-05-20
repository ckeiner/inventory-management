// Navigation structure for SaaS UI Kit sidebar
// This can be imported and customized in App.vue or any component using SaasLayout

export const sidebarNavItems = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        route: '/'
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: '📦',
        route: '/inventory'
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: '🛒',
        route: '/orders',
        badge: '3'
      },
      {
        id: 'spending',
        label: 'Spending',
        icon: '💰',
        route: '/spending'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    items: [
      {
        id: 'demand',
        label: 'Demand Forecast',
        icon: '📈',
        route: '/demand'
      },
      {
        id: 'restocking',
        label: 'Restocking',
        icon: '🔄',
        route: '/restocking'
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: '📋',
        route: '/reports'
      }
    ]
  }
]

export const quickActions = [
  {
    id: 'dashboard-quick',
    label: 'Dashboard',
    icon: '📊',
    route: '/'
  },
  {
    id: 'orders-quick',
    label: 'Orders',
    icon: '🛒',
    route: '/orders'
  },
  {
    id: 'inventory-quick',
    label: 'Inventory',
    icon: '📦',
    route: '/inventory'
  }
]
