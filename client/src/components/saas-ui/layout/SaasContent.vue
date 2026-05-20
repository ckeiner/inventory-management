<template>
  <main class="saas-content">
    <slot />
  </main>
</template>

<script setup>
// Presentational wrapper component
</script>

<style scoped>
.saas-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background-color: var(--saas-content-bg);
}

/* Scrollbar styling for webkit browsers */
.saas-content::-webkit-scrollbar {
  width: 8px;
}

.saas-content::-webkit-scrollbar-track {
  background: var(--saas-content-bg);
}

.saas-content::-webkit-scrollbar-thumb {
  background: var(--saas-border);
  border-radius: var(--saas-radius-sm);
}

.saas-content::-webkit-scrollbar-thumb:hover {
  background: var(--saas-border-dark);
}
</style>
