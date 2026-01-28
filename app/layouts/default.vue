<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <!-- Sidebar -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div class="flex items-center flex-shrink-0 px-4">
              <span class="text-xl font-bold">SchoolSys</span>
            </div>
            <nav class="mt-5 flex-1 px-2 bg-white space-y-1">
              <!-- Admin Links -->
              <template v-if="auth.user?.role === 'admin'">
                <NuxtLink to="/admin/dashboard" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">Dashboard</NuxtLink>
                <NuxtLink to="/admin/instructors" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">Instructors</NuxtLink>
                <NuxtLink to="/admin/students" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">Students</NuxtLink>
                <NuxtLink to="/admin/subjects" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">Subjects</NuxtLink>
              </template>

              <!-- Instructor Links -->
              <template v-if="auth.user?.role === 'instructor'">
                <NuxtLink to="/instructor/dashboard" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">Dashboard</NuxtLink>
                <NuxtLink to="/instructor/subjects" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">My Subjects</NuxtLink>
              </template>

              <!-- Student Links -->
              <template v-if="auth.user?.role === 'student'">
                <NuxtLink to="/student/dashboard" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">Dashboard</NuxtLink>
                <NuxtLink to="/student/subjects" class="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">My Classes</NuxtLink>
              </template>
            </nav>
          </div>
          <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div class="flex items-center">
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-700">{{ auth.user?.username || auth.user?.firstname }}</p>
                <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
              </div>
            </div>
            <button @click="auth.logout()" class="ml-auto text-sm text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
</script>
