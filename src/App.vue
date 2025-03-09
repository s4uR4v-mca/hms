<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RouteName } from './router/route-names';
import HmsNotification from './components/HmsNotification.vue';

const router = useRouter()
const gotoHome = () => {
  router.push({
    name: RouteName.HOME,
  });
}
</script>

<template>
  <header class=" p-3 bg-neutral-800 flex">
    <h1 @click="gotoHome"
      class="text-2xl font-bold min-w-4xl m-auto flex text-neutral-200 px-3 hover:text-neutral-300 cursor-pointer">
      Hospital Management System
    </h1>
  </header>
  <div>
    <RouterView />
    <HmsNotification />
  </div>
</template>
