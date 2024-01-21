<template>
    <div class="flex flex-column mx-auto justify-content-center">
        <h1 class="box mx-auto w-7">
            <div class="flex flex-column justify-content-center align-content-center align-items-center">
                <p class="my-2 text-6xl text-center">
                    Tomku! Idzie Ci coraz lepiej!
                </p>
                <p class="mb-2 text-5xl text-center">
                    W tym tygodniu blokowaliśmy ograniczone przez Ciebie strony jedynie <strong>2</strong> razy.
                </p>
                <p class="mb-2 text-4xl text-center">
                    Korzystałeś z telefonu o <strong>24 minuty</strong> krócej niż w ostatnim tygodniu!
                </p>
                <p class="mb-2 text-3xl text-center">
                    <router-link :to="{ name: 'Statistics' }">
                        Jeśli jesteś ciekawy innych statystyk, sprawdź je już teraz. 
                    </router-link>
                </p>
            </div>
        </h1>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date("2024-01-20 13:51:50.953997"))
</script>