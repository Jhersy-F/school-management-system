<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">My Managed Subjects</h2>
    
    <!-- Add Subject Section -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Add Subject to My List</h3>
      <div class="flex gap-4">
        <select v-model="selectedSubjectId" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="" disabled>Select a subject</option>
          <option v-for="subject in allSubjects" :key="subject.id" :value="subject.id">
            {{ subject.code }} - {{ subject.name }}
          </option>
        </select>
        <button @click="addSubject" :disabled="!selectedSubjectId || adding" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
          {{ adding ? 'Adding...' : 'Add' }}
        </button>
      </div>
      <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    </div>

    <!-- Managed Subjects List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Select a Subject to Manage Sections</h3>
      </div>
      <div v-if="subjects.length === 0" class="p-6 text-center text-gray-500">
        You haven't added any subjects yet.
      </div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="subject in subjects" :key="subject.id">
          <NuxtLink :to="`/instructor/subjects/${subject.id}`" class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">{{ subject.code }} - {{ subject.name }}</p>
                <div class="ml-2 flex-shrink-0 flex">
                   <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">View Sections</p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    {{ subject.description }}
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
// Fetch "My Subjects"
const { data: mySubjectsData, refresh } = await useFetch('/api/instructor/subjects')
const subjects = computed(() => mySubjectsData.value?.subjects || [])

// Fetch "All Subjects" for dropdown
const { data: allSubjectsData } = await useFetch('/api/subjects')
const allSubjects = computed(() => allSubjectsData.value?.subjects || [])

const selectedSubjectId = ref('')
const adding = ref(false)
const error = ref('')

async function addSubject() {
  if (!selectedSubjectId.value) return
  adding.value = true
  error.value = ''

  try {
    // Create a default section
    await $fetch('/api/instructor/sections', {
      method: 'POST',
      body: {
        name: 'Section 1', // Default name
        subjectId: selectedSubjectId.value
      }
    })
    selectedSubjectId.value = ''
    refresh() // Refresh the list
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to add subject'
  } finally {
    adding.value = false
  }
}
</script>
