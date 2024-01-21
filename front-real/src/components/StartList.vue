<template>
    <div class="flex flex-column mx-auto justify-content-center">
        <h1 class="box mx-auto text-6xl">Lista blokowanych stron</h1>
    </div>
    <div class="flex flex-column justify-content-center p-5">
        <Panel v-for="view in listViews" toggleable >
            <template #header>
                <div class="flex align-items-center gap-2" >
                    <span class="font-bold white-space-nowrap">{{ view.name }}</span>
                </div>
            </template>
            <template #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3" >
                    <div class="flex align-items-center gap-2">
                        <span class="p-text-secondary">Wykorzystano {{ getProcents(view.data.time, view.data.daily_usage) }}% dzisiejszego czasu.</span>
                    </div>
                    <span class="p-text-secondary">Blokuję od: {{ showDate(view.data.date_joined) }}</span>
                </div>
            </template>
            <template #icons>
                <Button type="button" text severity="info" class="p-2" @click="edit(view.name, view.data.daily_usage, view.data.pk)">
                    <span class="pi pi-pencil"></span>
                </Button>
                <Button type="button" text severity="danger" class="p-2"  @click="deleteLimit(view.data.pk)">
                    <span class="pi pi-trash"></span>
                </Button>
            </template>
            <p class="m-0">
                    <span class="block">
                        Limit: {{ view.data.daily_usage }} minut.
                    </span>
                    <span class="block">
                        Łącznie spędzony czas: {{  Math.round(view.data.time / 60 * 100) / 100 }} minut.
                    </span>
                    <span class="block">
                        Łącznie wejść: {{ view.data.count }}.
                    </span>
                </p>
        </Panel>
        <div class="flex align-items-center justify-content-center m-3">
            <Button @click="add" icon="pi pi-plus" severity="success" label="Dodaj ograniczenie" class="w-5 mt-4" iconPos="right" aria-label="Dodaj ograniczenie"></Button>
        </div>
    </div>

    <div class="flex flex-column mx-auto justify-content-center">
        <h1 class="box mx-auto text-6xl">Najczęściej odwiedzane przez Ciebie strony</h1>
    </div>
    <div class="flex flex-column justify-content-center mt-5 mb-3 p-5" v-for="best in bests">
        <h1 class="box mx-auto text-3xl">{{ best.name }}</h1>
        <div class="flex justify-content-around">
            <div class="flex flex-column align-items-center justify-content-center relative pt-4 px-3">
                <Button @click="edit(best.first.name, best.first.time/120)" type="button" icon="pi pi-ban" severity="danger" rounded size="small" class="absolute top-0 right-0"></Button>
                <span class="text-4xl text-red-600">{{ Math.round(best.first.time / 60 * 100) / 100 }} min</span>
                <span class="text-4xl text-red-600">{{ best.first.name }}</span>
            </div>
            <div class="flex flex-column align-items-center justify-content-center relative pt-4 px-3">
                <Button @click="edit(best.second.name, best.second.time/120)" type="button" icon="pi pi-ban" severity="danger" rounded size="small" class="absolute top-0 right-0"></Button>
                <span class="text-4xl text-orange-600">{{ Math.round(best.second.time / 60 * 100) / 100 }} min</span>
                <span class="text-4xl text-orange-600">{{ best.second.name }}</span>
            </div>
            <div class="flex flex-column align-items-center justify-content-center relative pt-4 px-3">
                <Button @click="edit(best.third.name, best.third.time/120)" type="button" icon="pi pi-ban" severity="danger" rounded size="small" class="absolute top-0 right-0"></Button>
                <span class="text-4xl text-yellow-700">{{ Math.round(best.third.time / 60 * 100) / 100 }} min</span>
                <span class="text-4xl text-yellow-700">{{ best.third.name }}</span>
            </div>
        </div>
    </div> 


    <Dialog v-model:visible="showAddLimitDialog" modal header="Dodaj ograniczenie" :style="{ width: '50vw' }">
        <div class="flex flex-column align-items-center justify-content-center">
            <InputGroup class="w-10 my-1">
                <InputText icon="pi pi-link" id="site_url" type="text"  v-model="model.site_url" placeholder="Link do strony"></InputText>                
                    <InputGroupAddon>
                        <i class="pi pi-link"></i>
                    </InputGroupAddon>
            </InputGroup>
            <small id="site_url-help" class="mb-4">Najlepiej podaj główną domenę np. "onet.com".</small>
            <InputNumber v-model="model.daily_usage" inputId="minmax-buttons" mode="decimal" showButtons class="w-10 my-3" :min="0" :max="1440" />
            <SelectButton v-model="limitType" :options="options" class="my-3 font-bold" aria-labelledby="basic" />
        </div>
        
        <template #footer>
            <div class="flex justify-content-center">
                <Button label="Ogranicz" icon="pi pi-load" @click="addLimit"></Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Button from "primevue/button";
import Badge from "primevue/badge";
import { ref } from "vue";

import axios from "axios"

const listViews = ref([])
const bests = ref([])
const options = ref(['Minuty', 'Godziny']);
const limitType = ref('Minuty')
const model = ref({
    site_url: '',
    daily_usage: 0,
})
const showAddLimitDialog = ref(false)
const editing = ref(false)
const pk = ref(0)

function add() {
    model.value.site_url = ''
    model.value.daily_usage = 0
    editing.value = false
    showAddLimitDialog.value = true
}

function edit(url, usage, pk_given) {
    model.value.site_url = url
    model.value.daily_usage = usage 
    pk.value = pk_given
    editing.value = true
    
    showAddLimitDialog.value = true
}

function showDate(date_joined)
{
    return date_joined.split('T')[0]
}

function getProcents(time, daily_usage) {
    if (daily_usage == 0) {
        return 100
    }
    if (time == 0) {
        return 0
    }
    return Math.round(time / (daily_usage * 60)*100 * 100) / 100
}

async function deleteLimit(pk) {
    const url = `/blocksite/${pk}/`
        await axios
        .delete(url)
    getData()
}

async function addLimit() {
    
    if(limitType.value == 'Godziny') model.value.daily_usage *= 60
    
    if(editing.value) {
        const url = `/blocksite/${pk.value}/`
        await axios
        .put(url, model.value)
    } else {
        const url = '/blocksite/'
        await axios
        .post(url, model.value)
    }

    model.value.site_url = ''
    model.value.daily_usage = 0

    getData()
    showAddLimitDialog.value = false
}

async function getData() {
    const url = '/limitations/'
    
    await axios
    .get(url)
    .then(async response => {
        listViews.value = response.data
    })
    .catch(error => {
        console.log(error);
    })
    
}
getData()


async function getExtraInfo() {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const url = '/sites/'
    const responseDay = await axios.get(url, { params: { start: yesterday, end: now}})
    let mostViewedSitesDay = responseDay.data
    
    mostViewedSitesDay = mostViewedSitesDay.sort((a, b) => parseFloat(b.time) - parseFloat(a.time)).slice(0, 3)
    
    const responseWeek = await axios.get(url, { params: { start: lastWeek, end: now}})
    
    let mostViewedSitesWeek = responseWeek.data
    
    mostViewedSitesWeek = mostViewedSitesWeek.sort((a, b) => parseFloat(b.time) - parseFloat(a.time)).slice(0, 3)

    const responseMonth = await axios.get(url, { params: { start: lastMonth, end: now}})
    
    let mostViewedSitesMonth = responseMonth.data
    
    mostViewedSitesMonth = mostViewedSitesMonth.sort((a, b) => parseFloat(b.time) - parseFloat(a.time)).slice(0, 3)

    bests.value = [
        {name: "dzisiaj", first: mostViewedSitesDay[0], second: mostViewedSitesDay[1], third: mostViewedSitesDay[2]},
        {name: "w ostatnim tygodniu", first: mostViewedSitesWeek[0], second: mostViewedSitesWeek[1], third: mostViewedSitesWeek[2]},
        {name: "w ostatnim miesiącu", first: mostViewedSitesMonth[0], second: mostViewedSitesMonth[1], third: mostViewedSitesMonth[2]},
    ]
}
getExtraInfo()


// async function x() {

//     let x = new Date()
//     x = new Date(x.getTime() - 6 * 60 * 1000);
//     const url = `/sites/`  
//     const model = {
//       site_url: "www.betclic",
//       start_date: x,
//       end_date: new Date(x.getTime() + 0 * 60 * 1000)
//     }
    
//     await axios.post(url, model)
// }
// x()
</script>