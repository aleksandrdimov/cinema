<template>
    <div class="film">
        <img :src=item.photo :alt="item.title" class="film__picture">
        <div class="film__content">
            <h3 class="film__title">{{ item.title }}</h3>
            <p class="film__date">{{ item.date }}</p>
            <div class="film__info">
                <span>{{ item.filmType }}</span>
                <span class="film__info-years">{{ item.limitation }}</span>
            </div>
            <ul class="film__session">
                <li v-for="(el, index) in item.sessions" :key="index" class="film__session-item"
                    :class="{ full: el.tickets.length === 12 }"> <a :href="'/' + item.title + '/' + el.time">{{ el.time
                        }}</a>
                </li>
            </ul>
        </div>
    </div>

</template>

<script setup>
const { item } = defineProps({ item: { type: Object, required: true } })

</script>

<style lang="scss" scoped>
.film {
    display: flex;
    gap: 24px;

    background-color: rgb(236, 236, 236);
    border-radius: 8px;

    padding: 24px;

    transition: background-color .3s ease-in-out;

    @media (max-width:680px) {
        align-items: center;
        padding: 16px;
    }

    &:hover {
        background-color: rgb(224, 224, 224);
    }



    &__picture {
        width: 120px;
        height: 200px;

        border-radius: 6px;
    }

    &__content {
        display: flex;
        flex-direction: column;

        gap: 16px;

        @media (max-width:680px) {
            gap: 8px;
        }
    }

    &__title {
        font-size: 22px;
        line-height: 30px;
        color: rgb(86, 121, 218);

        @media (max-width:680px) {
            font-size: 20px;
        }
    }

    &__date {
        font-size: 16px;
        line-height: 22px;
        color: rgb(134, 122, 122);
    }

    &__info {
        display: flex;
        align-items: center;
        gap: 14px;

        & span {
            font-size: 20px;

            @media (max-width:680px) {
                font-size: 16px;
            }
        }
    }

    &__info-years {
        color: rgb(245, 245, 245);

        background-color: rgb(168, 57, 57);
        border-radius: 50%;

        padding: 4px;
    }

    &__session {
        display: flex;
        gap: 16px;

        @media (max-width:680px) {
            flex-wrap: wrap;
        }
    }

    &__session-item {
        cursor: pointer;
        font-size: 14px;
        letter-spacing: 1px;


        background-color: rgb(86, 134, 207);
        border-radius: 4px;

        padding: 4px 12px;

        transition: background-color .3s ease-in-out;

        @media (max-width:680px) {
            font-size: 12px;
            padding: 4px 8px;
        }

        & a {
            color: white;
        }

        &:hover {
            background-color: rgb(62, 97, 150);
            animation: shadow 2s ease-in-out infinite;
        }

        &:active {
            background-color: rgb(40, 64, 100);
        }

        &.full {
            pointer-events: none;
            background-color: rgb(168, 57, 57);
        }
    }
}

@keyframes shadow {
    0% {
        box-shadow: 0 0 0 0 rgb(62, 97, 150);
    }

    50% {
        box-shadow: 0 0 10px 2px rgb(62, 97, 150);
    }

    100% {
        box-shadow: 0 0 0 0 rgb(62, 97, 150);
    }
}
</style>