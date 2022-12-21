<template>
    <div id="right-sidebar">
        <div class="sidebar-menu">
            <OverviewSidebar />
        </div>
        <div class="sidebar-image">
            <img src="/logo_rechts.png" />
        </div>
    </div>
</template>

<script setup>
import OverviewSidebar from '@/components/rightsidebar/OverviewSidebar.vue';
</script>

<style scoped lang="scss">
#right-sidebar {
    color: white;
    height: 100%;
    .sidebar-menu {
        height: 70%;
    }

    .sidebar-image {
        height: 30%;
        display: flex;
        align-items: flex-end;

        img {
            max-height: 100%;
            max-width: 100%;
        }
    }
}
</style>