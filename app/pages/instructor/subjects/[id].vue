<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Manage Sections</h2>
      <button @click="showAddModal = true" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Section</button>
    </div>

    <!-- Sections List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div v-if="sections.length === 0" class="p-6 text-center text-gray-500">
        No sections created for this subject yet.
      </div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="section in sections" :key="section.id">
          <NuxtLink :to="`/instructor/sections/${section.id}`" class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">{{ section.name }}</p>
                <div class="ml-2 flex-shrink-0 flex">
                   <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Manage Students</p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    Created: {{ new Date(section.createdAt).toLocaleDateString() }}
                  </p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Add Section Modal -->
    <div v-if="showAddModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showAddModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="createSection">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create New Section</h3>
              <div class="mt-2">
                <input v-model="newSectionName" placeholder="Section Name (e.g. A, morning-class)" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" :disabled="creating" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                Create
              </button>
              <button type="button" @click="showAddModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const subjectId = route.params.id

const { data, refresh } = await useFetch('/api/instructor/sections', {
  query: { subjectId }
})
const sections = computed(() => data.value?.sections || [])

const showAddModal = ref(false)
const newSectionName = ref('')
const creating = ref(false)

async function createSection() {
  if (!newSectionName.value) return
  creating.value = true
  try {
    await $fetch('/api/instructor/sections', {
      method: 'POST',
      body: {
        name: newSectionName.value,
        subjectId: parseInt(subjectId as string)
      }
    })
    newSectionName.value = ''
    showAddModal.value = false
    refresh()
  } catch (e) {
    alert('Failed to create section')
  } finally {
    creating.value = false
  }
}
</script>
