<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Welcome Admin</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink to="/admin/instructors" class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
        <h3 class="text-lg font-semibold text-gray-900">Manage Instructors</h3>
        <p class="text-gray-600 mt-2">Add or view instructors.</p>
      </NuxtLink>
      <NuxtLink to="/admin/students" class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
        <h3 class="text-lg font-semibold text-gray-900">Manage Students</h3>
        <p class="text-gray-600 mt-2">Add or view students.</p>
      </NuxtLink>
      <NuxtLink to="/admin/subjects" class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
        <h3 class="text-lg font-semibold text-gray-900">Manage Subjects</h3>
        <p class="text-gray-600 mt-2">Add or view subjects.</p>
      </NuxtLink>
    </div>
  </div>
</template>
