<template>
    <section class="booking">
        <a href="/" class="booking__button-back"> <-- Home </a>
                <h2 class="booking__title">{{ film?.title }}</h2>
                <p class="booking__session-info">{{ film?.date }} <span>{{ session }}</span> </p>
                <div class="booking__wrap">
                    <div class="booking__arrangement">
                        <p class="booking__screen">Screen</p>
                        <div class="booking__chairs">
                            <ChairItem v-for="index in 140" :key="index" :item="currentSession" :index="index"
                                :selected-index="selectedIndex" :delete-all="isDeleteAll"
                                :index-item-delete="indexItemDelete" @select="isSelectChair" />
                        </div>

                        <div class="booking__chair">
                            <div class="booking__chair">
                                <span class="booking__chair-icon active"></span> <span
                                    class="booking__chair-description">sold seat</span>
                            </div>
                            <div class="booking__chair">
                                <span class="booking__chair-icon select"></span> <span
                                    class="booking__chair-description">select seat</span>
                            </div>
                            <div class="booking__chair">
                                <span class="booking__chair-icon"></span> <span class="booking__chair-description">free
                                    seat</span>
                            </div>
                        </div>
                    </div>
                    <div class="booking__purchase">
                        <h4 class="booking__subtitle">
                            Selected seats
                        </h4>
                        <div class="booking__row">
                            <span>Row</span><span>Seat</span><span>Price</span>
                        </div>

                        <div v-if="selectedPlaces.length" class="booking__row" v-for="(ticket, index) in selectedPlaces"
                            :key="index">
                            <p>{{ ticket.row }}</p>
                            <p>{{ ticket.chair }}</p>
                            <div class="booking__price">
                                <p>{{ ticket.price }} $</p>
                                <button class="booking__button-delete" @click="deleteItem(index)"></button>
                            </div>
                        </div>

                        <div v-if="selectedPlaces.length > 1" class="booking__row-sb">
                            <p>Delete all</p>
                            <button class="booking__button-delete" @click="deleteAll"></button>
                        </div>

                        <div class="booking__row-sb">
                            <span>Total:</span>
                            <span>{{ totalNumber }} $</span>
                        </div>
                        <button class="booking__button-buy" @click="buyTickets">Buy</button>
                    </div>
                </div>
    </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import ChairItem from './ChairItem.vue'
import { useRoute } from 'vue-router';
import { useCatalogStore } from '@/stores/catalog';
import { storeToRefs } from 'pinia';

const { filmName, session } = useRoute().params

const catalogStore = useCatalogStore();
const { getFilmByName, getAllFilms: allFilms } = storeToRefs(catalogStore)

const film = getFilmByName.value(filmName)
const currentSession = film.sessions.find(el => el.time === session)

const selectedPlaces = ref([])
const selectedIndex = ref([])
const isDeleteAll = ref(false)
const indexItemDelete = ref(0)
const totalNumber = ref(0)

const nameIndex = ref()
const sessionIndex = ref()

const storeSoldItems = ref([])
const currentStore = ref()

function isSoldTicketsStore() {
    currentStore.value = JSON.parse(localStorage.getItem('store'));

    if (currentStore.value) {
        const currentResult = currentStore.value.filter(el => el.name === filmName && el.session === session)

        if (currentResult.length) {
            currentResult.forEach(el => storeSoldItems.value.push(...el.tickets))

            currentSession.tickets.push(...storeSoldItems.value)
        }
    }
}


function isSelectChair(data) {
    isDeleteAll.value = false;
    selectedPlaces.value.length !== selectedIndex.value.length ? selectedIndex.value = [] : ''

    const row = Math.ceil(data[0] / 20)
    const chair = data[0] - 20 * (row - 1)
    const newChoose = { id: data[0], row: row, chair: chair, price: 50 + 50 * 0.5 * (row - 1) }

    if (data[1]) {
        selectedPlaces.value.push(newChoose)
        selectedIndex.value.push(data[0])
    } else {
        selectedPlaces.value.forEach((el, index) => {
            el.row === newChoose.row && el.chair === newChoose.chair ? deleteItem(index) : ''
        })
    }
}

function deleteAll() {
    indexItemDelete.value = 0
    totalNumber.value = 0
    isDeleteAll.value = true

    // не понимаю почему не работает selectedPlaces.value=[] , если так пишу то если не обновлять страницу и опять выбрать места то не срабатывает вотчер и ошибок никаких нет. Почему?//
    selectedPlaces.value.splice(0, selectedPlaces.value.length)
}

function deleteItem(index) {
    indexItemDelete.value = selectedPlaces.value[index].id
    selectedPlaces.value.splice(index, 1)
    selectedIndex.value.splice(index, 1)

    isDeleteAll.value = true
}

function calcTotalPrice() {
    totalNumber.value = 0
    selectedPlaces.value.forEach(el => totalNumber.value += el.price)
}

function calcCurrentIndex() {
    allFilms.value.forEach((film, index) => {
        if (film.title === filmName) {
            nameIndex.value = index;

            film.sessions.forEach((el, idx) => el.time === session ? sessionIndex.value = idx : '')
        }
    })
}

function buyTickets() {
    isSoldTicketsStore()
    deleteAll()

    const tickets = selectedIndex.value;
    let store;

    calcCurrentIndex()
    catalogStore.addTickets({ tickets, nameIndex, sessionIndex })

    const newStore = { name: filmName, session: session, tickets: tickets }
    currentStore.value !== null ? store = [...currentStore.value, newStore] : store = [newStore]

    localStorage.setItem('store', JSON.stringify(store))
}

watch(selectedPlaces.value, () => {
    calcTotalPrice()
})


onMounted(() => {
    isSoldTicketsStore()
})

</script>

<style lang="scss" scoped>
.booking {
    position: relative;

    @media (max-width:1024px) {
        padding-top: 24px;
    }

    &__button-back {
        position: absolute;
        z-index: 10;
        top: 15px;
        left: 15px;

        color: white;

        background-color: rgb(248, 162, 162);
        border-radius: 15px;

        padding: 5px 15px;

        transition: background-color .3s ease-in-out;

        @media (max-width:1024px) {
            top: 0;
            left: 0;
        }

        @media (max-width:680px) { 
            font-size: 12px;
        }

        &:hover {
            background-color: rgb(212, 96, 96);
            animation: shadow 1.5s ease-in-out infinite;
        }

        &:active {
            background-color: rgb(168, 57, 57);
        }
    }

    &__title {
        text-align: center;
        font-size: 46px;
        font-weight: 500;
        color: rgb(168, 57, 57);

        @media (max-width:1024px) {
            font-size: 36px;
        }

        @media (max-width:680px) {
            font-size: 26px;
        }
    }

    &__session-info {
        text-align: center;
        font-size: 24px;
        color: rgb(155, 155, 155);

        @media (max-width:1024px) {
            font-size: 20px;
        }

        @media (max-width:680px) {
            font-size: 16px;
        }

        & span {
            font-weight: 600;
            font-size: 30px;
            color: rgb(168, 57, 57);

            @media (max-width:1024px) {
                font-size: 24px;
            }

            @media (max-width:680px) {
                font-size: 20px;
            }
        }
    }

    &__wrap {
        display: flex;
        justify-content: space-between;

        gap: 16px;

        @media (max-width:1024px) {
            flex-direction: column;
            justify-content: center;
            align-items: center;

            gap: 36px;
        }
    }

    &__arrangement {
        max-width: 750px;
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 48px;

        @media (max-width:680px) {
            gap: 24px;
        }
    }

    &__screen {
        position: relative;
        width: 100%;

        text-align: center;
        text-transform: uppercase;
        letter-spacing: 10px;
        color: rgb(161, 161, 161);

        background-color: rgb(191, 232, 255);

        @media (max-width:680px) {
            font-size: 12px;
        }

        &::after,
        &::before {
            content: "";
            position: absolute;
            z-index: 3;

            width: 0;
            height: 0;

            border-top: 24px solid white;

            @media (max-width:680px) {
                border-top-width: 20px;
            }
        }

        &::before {
            left: 0;
            border-right: 96px solid transparent;

            @media (max-width:680px) {
                border-right-width: 48px;
            }
        }

        &::after {
            right: 0;
            border-left: 96px solid transparent;

            @media (max-width:680px) {
                border-left-width: 48px;
            }
        }
    }

    &__chairs {
        display: grid;
        grid-template-columns: repeat(20, 20px);
        grid-template-rows: repeat(7, 25px);

        gap: 4px;

        @media (max-width:680px) {
            grid-template-columns: repeat(20, 12px);
            grid-template-rows: repeat(7, 18px);

            gap: 4px;
        }
    }

    &__chair {
        display: flex;
        gap: 4px;

        @media (max-width:680px) {
            flex-wrap: wrap;
            justify-content: center;
        }
    }

    &__chair-icon {
        width: 20px;
        height: 25px;

        background-color: rgb(71, 173, 71);
        border-radius: 4px;

        @media (max-width:680px) {
            width: 15px;
            height: 20px;
        }

        &.active {
            background-color: rgb(168, 57, 57);
        }

        &.select {
            background-color: rgb(155, 155, 38);
        }
    }

    &__chair-description {
        position: relative;
        padding: 0 10px 0 30px;

        &::before {
            content: "";
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);

            width: 15px;
            height: 2px;

            background-color: grey;
        }
    }

    &__purchase {
        max-width: 250px;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__subtitle {
        font-size: 20px;
        letter-spacing: .5px;
    }

    &__row {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        align-items: center;
        gap: 12px;

        border-bottom: 1px solid rgb(214, 214, 214);

        padding: 5px;

        & span {
            font-size: 12px;
        }
    }

    &__price {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
    }

    &__button-delete {
        cursor: pointer;
        position: relative;
        width: 24px;
        height: 24px;

        background-color: rgb(216, 216, 216);
        border-radius: 50%;
        border: none;

        &::before,
        &::after {
            content: "";
            position: absolute;
            z-index: 2;

            top: 50%;
            left: 50%;

            display: block;
            width: 14px;
            height: 2px;

            background-color: black;

            transition: background-color .3s ease-in-out;
        }

        &::before {
            transform: translate(-50%, -50%) rotate(45deg);
        }

        &::after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }

        &:hover {

            &::after,
            &::before {
                background-color: rgb(187, 36, 36);
            }
        }
    }

    &__row-sb {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0 5px;

        & span {
            font-weight: 600;
        }
    }

    &__button-buy {
        cursor: pointer;

        font-size: 16px;
        color: white;

        background-color: rgb(252, 89, 89);
        border-radius: 40px;
        border: none;

        padding: 12px;

        transition: background-color .3s ease-in-out;

        &:hover {
            background-color: rgb(247, 56, 56);
        }

        &:active {
            background-color: rgb(179, 28, 28);
        }
    }
}

@keyframes shadow {
    0% {
        box-shadow: 0 0 0 0 rgb(212, 96, 96);
    }

    50% {
        box-shadow: 0 0 10px 2px rgb(212, 96, 96);
    }

    100% {
        box-shadow: 0 0 0 0 rgb(212, 96, 96);
    }
}
</style>