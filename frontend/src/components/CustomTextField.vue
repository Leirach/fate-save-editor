<template>
    <!-- need to re emit update:model-value for some reason -->
    <v-text-field v-bind="$attrs, $props" type="number" class="custom-text"
        @update:model-value="$emit('update:modelValue', $event)">
        <div class="buttons">
            <button v-on:mousedown="press('minus')" v-on:mouseup="release('minus')" v-on:click="click('minus')"
                :disabled="disableMinus">
                <img :src="minusImg[minusIdx]">
            </button>
            <button v-on:mousedown="press('plus')" v-on:mouseup="release('plus')" v-on:click="click('plus')">
                <img :src="plusImg[plusIdx]">
            </button>
        </div>
    </v-text-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import minus_img from '../assets/minus.png';
import minus_pressed from '../assets/minus-pressed.png';
import minus_disabled from '../assets/minus-disabled.png';
import plus_img from '../assets/plus.png';
import plus_pressed from '../assets/plus-pressed.png';
import { VTextField } from "vuetify/components";

export default defineComponent({
    name: 'v-number-field',
    props: ['type', 'key', 'model'],
    extends: VTextField,
    created: function () {
        if (this.$props.modelValue <= 0) {
            this.disableMinus = true;
            this.minusIdx = 2;
        }
    },
    data: function () {
        return {
            minusImg: [minus_img, minus_pressed, minus_disabled],
            plusImg: [plus_img, plus_pressed],
            minusIdx: 0,
            plusIdx: 0,
            disableMinus: false
        }
    },
    methods: {
        press: function (type: 'minus' | 'plus') {
            if (type === 'minus') this.minusIdx = 1;
            else this.plusIdx = 1;
        },
        release: function (type: 'minus' | 'plus') {
            if (type === 'minus') this.minusIdx = 0;
            else this.plusIdx = 0;
        },
        click: function (type: 'minus' | 'plus') {
            if (type === 'minus') this.$emit('--');
            else this.$emit('++');
        }
    },
    emits: ['++', '--'],
    watch: {
        '$props.modelValue': function (value) {
            if (value <= 0) {
                this.disableMinus = true;
                this.minusIdx = 2;
            }
            else {
                this.disableMinus = false;
                this.minusIdx = 0;
            }
        }
    }
})
</script>

<style>
.custom-text .v-field__input {
    flex-direction: row-reverse;
}

.buttons {
    cursor: pointer !important;
    position: relative;
    top: -5px;
    height: 24px;
}

.buttons button {
    height: 100%;
    margin-right: 5px;
}

.buttons img {
    max-height: 100%;
}

input[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
}
</style>