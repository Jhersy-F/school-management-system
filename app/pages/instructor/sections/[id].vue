<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Section Management</h2>
      <NuxtLink :to="`/instructor/subjects`" class="text-indigo-600 hover:text-indigo-900">Back to Subjects</NuxtLink>
    </div>

    <!-- Enroll Student -->
    <div class="bg-white shadow sm:rounded-lg mb-6 p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Enroll Student</h3>
      <form @submit.prevent="enrollStudent" class="flex gap-4">
        <input v-model="identifier" placeholder="Email or Student Number" class="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <button type="submit" :disabled="enrolling" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Enroll</button>
      </form>
      <div v-if="enrollMsg" class="mt-2 text-sm text-green-600">{{ enrollMsg }}</div>
      <div v-if="enrollError" class="mt-2 text-sm text-red-600">{{ enrollError }}</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Students List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Enrolled Students</h3>
        </div>
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="student in students" :key="student.id" class="px-4 py-4 sm:px-6">
             <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">{{ student.firstname }} {{ student.lastname }}</p>
                <div class="ml-2 flex-shrink-0 flex">
                   <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{{ student.studentNumber }}</p>
                </div>
              </div>
          </li>
          <li v-if="students.length === 0" class="px-4 py-4 text-sm text-gray-500">No students enrolled.</li>
        </ul>
      </div>

      <!-- Documents List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Student Uploads</h3>
        </div>
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="doc in documents" :key="doc.id" class="px-4 py-4 sm:px-6">
             <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">{{ doc.filePath.split('/').pop() || 'Document' }}</p>
                <a :href="doc.filePath" target="_blank" download class="text-xs text-indigo-500 hover:text-indigo-700">Download</a>
              </div>
              <p class="mt-1 text-sm text-gray-500">By: {{ doc.studentName }} {{ doc.studentLastname }}</p>
          </li>
          <li v-if="documents.length === 0" class="px-4 py-4 text-sm text-gray-500">No documents uploaded.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sectionId = route.params.id

const { data: studentsData, refresh: refreshStudents } = await useFetch(`/api/instructor/sections/${sectionId}/students`)
const students = computed(() => studentsData.value?.students || [])

const { data: docsData } = await useFetch(`/api/instructor/sections/${sectionId}/documents`)
const documents = computed(() => docsData.value?.documents || [])

const identifier = ref('')
const enrolling = ref(false)
const enrollMsg = ref('')
const enrollError = ref('')

async function enrollStudent() {
  if (!identifier.value) return
  enrolling.value = true
  enrollMsg.value = ''
  enrollError.value = ''
  
  try {
    const res = await $fetch(`/api/instructor/sections/${sectionId}/students`, {
      method: 'POST',
      body: { identifier: identifier.value }
    })
    enrollMsg.value = 'Student enrolled successfully'
    identifier.value = ''
    refreshStudents()
  } catch (e: any) {
    enrollError.value = e.data?.message || 'Failed to enroll student'
  } finally {
    enrolling.value = false
  }
}
</script>
