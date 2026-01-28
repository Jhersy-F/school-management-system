<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Welcome Instructor</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/instructor/subjects" class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
        <h3 class="text-lg font-semibold text-gray-900">My Subjects & Sections</h3>
        <p class="text-gray-600 mt-2">Manage sections and enroll students.</p>
      </NuxtLink>
    </div>
  </div>
</template>
