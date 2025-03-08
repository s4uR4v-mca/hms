<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RouteName } from './router/route-names';

const router = useRouter()
const gotoHome = () => {
  router.push({
    name: RouteName.HOME,
  });
}
</script>

<template class="bg-blue-100">
  <header class="p-4 bg-blue-300 flex">
    <h1 @click="gotoHome"
      class="text-2xl font-bold min-w-4xl m-auto flex text-blue-900 px-3 hover:underline hover:text-blue-700 cursor-pointer">
      Hospital
      Management System
    </h1>
  </header>
  <div>
    <RouterView />
  </div>
</template>
