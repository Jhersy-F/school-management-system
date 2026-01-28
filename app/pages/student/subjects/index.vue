<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">My Classes</h2>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div v-if="sections.length === 0" class="p-6 text-center text-gray-500">
        You are not enrolled in any classes yet.
      </div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="section in sections" :key="section.id">
          <NuxtLink :to="`/student/subjects/${section.id}`" class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">{{ section.subjectCode }} - {{ section.name }}</p>
                <div class="ml-2 flex-shrink-0 flex">
                   <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{{ section.subjectName }}</p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    Instructor: {{ section.instructorName }}
                  </p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/student/sections')
const sections = data.value?.sections || []
</script>
