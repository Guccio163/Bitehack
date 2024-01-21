<template>
    <div class="flex flex-column justify-content-center">
        <Accordion :activeIndex="0">
            <AccordionTab v-for="view in listViews">
                <template #header>
                    <span class="flex align-items-center gap-2 w-full">
                        <span class="font-bold white-space-nowrap">{{ view.name }}</span>
                        <Badge :value="getProcents(view.data.time, view.data.daily_usage)" 
                        :severity="getProcents(view.data.time, view.data.daily_usage) < 33 ? 'success' : getProcents(view.data.time, view.data.daily_usage) < 66 ? 'warning' : 'danger'" class="ml-auto" />
                    </span>
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
            </AccordionTab>
        </Accordion>
        <div class="flex align-items-center justify-content-center m-3">
            <Button @click="showAddLimitDialog = true" icon="pi pi-plus" severity="warning" label="Dodaj ograniczenie" class="w-5" iconPos="right" aria-label="Dodaj ograniczenie"></Button>
        </div>
    </div>
    <Dialog v-model:visible="showAddLimitDialog" modal header="Dodaj ograniczenie" :style="{ width: '50vw' }">
        <div class="flex flex-column align-items-center justify-content-center">
            <h3>Wczytaj</h3>
            <InputText type="text" size="large" v-model="model.site_url" class="w-10 my-3 font-bold"></InputText>
            <InputNumber v-model="model.daily_usage" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="1440" />
            <SelectButton v-model="limitType" :options="options" aria-labelledby="basic" />
        </div>
        <template #footer>
            <div class="flex justify-content-center">
                <Button label="Wczytaj" icon="pi pi-load" @click=""></Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Button from "primevue/button";
import Badge from "primevue/badge";
import { ref } from "vue";

import axios from "axios"

const listViews = ref([])
const options = ref(['Minuty', 'Godziny']);
const limitType = ref('Minuty')
const model = ref({
    site_url: '',
    daily_usage: 0,
})
const showAddLimitDialog = ref(false)


function getProcents(time, daily_usage) {
    if (daily_usage == 0) {
        return 100
    }
    if (time == 0) {
        return 0
    }
    return Math.round(time / (daily_usage * 60) * 100) / 100
}

async function addLimit() {
    const url = '/blocksite/'
    
    

    await axios
    .get(url)
    .then(async response => {
        listViews.value = response.data
        console.log(listViews.value);
    })
    .catch(error => {
        console.log(error);
    })
}

async function getData() {
    const url = '/limitations/'
    
    await axios
    .get(url)
    .then(async response => {
        listViews.value = response.data
        console.log(listViews.value);
    })
    .catch(error => {
        console.log(error);
    })
    
}
getData()

</script>