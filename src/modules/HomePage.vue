<template>
    <section class="home">
        <div class="home__wrap">
            <h2 class="home__title">Movies Today :</h2>
            <FilmItem v-if="allFilms.length" v-for="film in allFilms" :key="film.id" :item="film" />
        </div>
    </section>
</template>

<script setup>
import FilmItem from './FilmItem.vue'
import { useCatalogStore } from '@/stores/catalog';
import { storeToRefs } from 'pinia';

const catalogStore = useCatalogStore();
const { getAllFilms:allFilms} = storeToRefs(catalogStore)
</script>

<style lang="scss" scoped>
.home {
    &__wrap {
        display: flex;
        flex-direction: column;
        gap: 24px;

        @media (max-width:680px){
            gap: 16px;
        }
    }

    &__title {
        font-size: 36px;
        color: rgb(168, 57, 57);
        text-align: center;

        @media (max-width:680px){
            font-size: 24px;
        }
    }
}
</style>