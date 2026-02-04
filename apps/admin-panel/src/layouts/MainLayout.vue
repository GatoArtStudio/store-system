<script setup lang="ts">
// Main Layout for authenticated users
</script>

<template>
  <div class="main-layout">
    <aside class="sidebar">
      <!-- Sidebar will go here -->
      <nav>Sidebar</nav>
    </aside>
    <div class="content-wrapper">
      <header class="navbar">
        <!-- Navbar will go here -->
        <nav>Navbar</nav>
      </header>
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 1rem;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.navbar {
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  padding: 0 1rem;
  display: flex;
  align-items: center;
}

.page-content {
  padding: 2rem;
  flex: 1;
}
</style>
