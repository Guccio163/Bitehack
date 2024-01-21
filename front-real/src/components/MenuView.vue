<template>
<div class="card relative z-2 shadow-3 mb-5" style="min-height: 80px;">
    <Menubar :model="mainMenu" style="min-height: 80px;">
        <template #start>
            <router-link :to="{ name: 'Main' }" class="flex px-3 mr-3 align-items-center text-600 hover:text-900 hover:surface-100 cursor-pointer">
                <i class="pi pi-home mx-2" style="font-size: 1.4rem;"></i>
                <h3>IHelp</h3>
            </router-link>
        </template>
        <template #end>
            <div class="flex align-items-center justify-content-center">
                <Menubar class="border-none" :model="userMenu" />
            </div>
        </template>
    </Menubar>
</div>

</template>

<script setup>
import Menubar from 'primevue/menubar'
import { ref } from 'vue';

import { useRouter } from 'vue-router'
const router = useRouter()

const userMenu = ref([
    {
        label: () => "tomek14",
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Ustawienia',
                icon: 'pi pi-fw pi-cog',
            },
            {
                separator: true
            },
            {
                label: 'Wyloguj',
                icon: 'pi pi-fw pi-sign-out',
                // command: () => logout()
            }
        ]
    }
]);

const mainMenu = ref([
    {
        label: 'Twoje osiągnięcia',
        icon: 'pi pi-chart-line',
        command: () => router.push('/stats')
    },
]);


</script>