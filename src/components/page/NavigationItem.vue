<template>
    <div class="menu-item menu-icon" :class="{ 'active': navigationStore.getActivePage === page}"
      @click="navigationStore.setActivePage(page)">
        <i :class="`pi ${icon}`" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNavigationStore } from '@/stores/navigation';

const props = defineProps({
    icon: String,
    page: String,
});

const navigationStore = useNavigationStore();

</script>

<style scoped lang="scss">

.menu-icon {
    margin: 2rem 0rem;
    cursor: pointer;
    color: #809199;
    padding: .5rem;
    border-radius: 5px;
    transition: color .25s ease-in-out, background-color .25s ease-in-out;

    &.active, &:hover {
        color: white;
        background: #314854;
    }

    .pi {
        font-size: 1.5rem;
    }
}

</style>