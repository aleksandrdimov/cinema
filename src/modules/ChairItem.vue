<template>
    <p class="chair" :class="[{ select: isSelected }, { active: isSell }]" @click="isSelectChair"></p>
</template>

<script setup>
import { onMounted, onUpdated, ref, watch } from 'vue';

const props = defineProps({
    item: { type: Object, required: true },
    index: { type: Number, required: true },
    indexItemDelete: { type: Number, required: false},
    deleteAll: { type: Boolean, required: false },
    selectedIndex: { type: Array, required: false },
})

const emit = defineEmits(['select'])

const isSelected = ref(false)
const isSell = ref(false)

function findTicketNumber() {
        if (props.item.tickets.length) {
            isSell.value = props.item.tickets.includes(props.index)
        }
}

function isSelectChair() {
    emit('select', [props.index, !isSelected.value])
    isSelected.value = !isSelected.value
}

function isRemoveSelect() {
    if (props.deleteAll&&props.indexItemDelete===0) {
        props.selectedIndex.includes(props.index)?isSelected.value=false:''
    }

    if(props.deleteAll&&props.indexItemDelete!==0){
        props.indexItemDelete===props.index?isSelected.value=false:''
    }
}

watch(props, () => {
       findTicketNumber()
})

onMounted(() => {
    findTicketNumber()
})

onUpdated(()=>{
    isRemoveSelect()
})
</script>

<style lang="scss" scoped>
.chair {
    cursor: pointer;

    background-color: rgb(71, 173, 71);
    border-radius: 4px;

    transition: background-color .2s ease-in-out;

    &:hover {
        background-color: rgb(53, 128, 53);
    }

    &.active {
        pointer-events: none;
        background-color: rgb(168, 57, 57);
    }

    &.select {
        background-color: rgb(155, 155, 38);
    }
}
</style>