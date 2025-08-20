<style scoped>
.group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    min-width: 80%;
}

.input {
    width: 100%;
    height: 2.5rem;
    padding: 0 2.5rem;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: var(--dark-color);
    transition: .3s ease;
}

.input::placeholder {
    color: #9e9ea7;
}

.input:focus,
.input:hover {
    outline: none;
    border-color: rgba(238, 229, 232, 0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(150, 147, 148, 0.1);
}

.icon {
    position: absolute;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
    pointer-events: none;
}

.clear-icon {
    position: absolute;
    right: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    display: none;
}

.group.has-text .clear-icon {
    display: block;
}

/* отключаем встроенный крестик браузера */
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
    display: none !important;
    -webkit-appearance: none;
    appearance: none;
}

/*
input[type="search"]::-ms-clear,
input[type="search"]::-ms-reveal {
  display: none !important;
  width: 0;
  height: 0;
}*/
</style>

<template>
    <div class="group" :class="{ 'has-text': search.length }">
        <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 
               4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 
               3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 
               11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 
               7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
        </svg>

        <input v-model="search" placeholder="Поиск" type="search" class="input">

        <svg v-if="search.length" @click="search = ''" class="clear-icon" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 
               10.59 7.11 5.7A1 1 0 1 0 5.7 
               7.11L10.59 12l-4.9 4.89a1 1 0 1 0 
               1.41 1.41L12 13.41l4.89 4.9a1 1 0 
               0 0 1.41-1.41L13.41 12l4.9-4.89a1 
               1 0 0 0-.01-1.4z" />
        </svg>
    </div>
</template>

<script setup>
import { ref } from "vue";

const search = ref("");
</script>
