<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Welcome Student</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/student/subjects" class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
        <h3 class="text-lg font-semibold text-gray-900">My Classes</h3>
        <p class="text-gray-600 mt-2">View enrolled classes and upload documents.</p>
      </NuxtLink>
    </div>
  </div>
</template>
