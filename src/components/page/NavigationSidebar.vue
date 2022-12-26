<template>
  <div id="navSidebar" class="sidebar">
		<div class="up">
			<div class="menu-item logo"><img src="/logo.png" /></div>
			<NavigationItem page="overview" icon="pi-calendar" />
			<NavigationItem page="sinkingfunds" icon="pi-wallet" />
			<!---<NavigationItem page="charts" icon="pi-chart-pie" />-->
		</div>
		<Avatar v-if="profileStore.hasUserName" :label="profileStore.getUserName.charAt(0)" class="profile-icon"
			 size="large" shape="circle" @click="() => navigationStore.setActivePage('profile')" />
		<Avatar v-else icon="pi pi-user" class="profile-icon" size="large" shape="circle" @click="() => navigationStore.setActivePage('profile')"/>
	</div>
</template>

<script setup>
import NavigationItem from './NavigationItem.vue';

import { useNavigationStore } from '@/stores/navigation';
import { useProfileStore } from '@/stores/profile';

const navigationStore = useNavigationStore();
const profileStore = useProfileStore();
</script>

<style scoped lang="scss">
.sidebar {
	width: 100px;
	height: 95%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;

	.up {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.logo {
		width: 50px;
		height: 50px;
		margin-bottom: 5rem;
		margin-top: .8rem;

		img {
			max-width: 100%;
		}
	}

	.profile-icon {
		cursor: pointer;
	}
}
</style>