<script setup lang="ts">
import { useHmsNotification } from '@/composables/useHmsNotification';
import { PhCheckCircle, PhX, PhXCircle } from '@phosphor-icons/vue';

const { notifications, removeNotification } = useHmsNotification();
</script>

<template>
    <div class="fixed inset-0 flex  px-4 py-6 pointer-events-none p-6 items-start justify-end">
        <TransitionGroup name="hms-notification" tag="div" class="flex flex-col space-y-4 w-full max-w-md">
            <div v-for="notification in notifications" :key="notification.id"
                class="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1">
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <PhCheckCircle v-if="notification.type === 'success'" class="w-5 h-5 text-green-400" />
                            <PhXCircle v-if="notification.type === 'error'" class="w-5 h-5 text-red-400" />
                        </div>
                        <div class="ml-3 w-0 flex-1 pt-0.5">
                            <p class="text-sm font-medium text-gray-800">{{ notification.title }}</p>
                            <p v-if="notification.message" class="mt-1 text-sm text-gray-600">{{ notification.message }}
                            </p>
                        </div>
                        <div class="ml-4 flex-shrink-0 flex">
                            <button @click="removeNotification(notification.id)"
                                class="bg-transparent rounded-md text-neutral-900">
                                <PhX class="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.hms-notification-enter-active,
.hms-notification-leave-active {
    transition: all 0.3s ease;
}

.hms-notification-enter-from {
    opacity: 0;
    transform: translateX(6rem);
}

.hms-notification-leave-to {
    opacity: 0;
    transform: translateX(6rem);
}
</style>
