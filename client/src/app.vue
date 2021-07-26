<template>
    <router-view :key="$route.fullPath"></router-view><!--fullPath re-renders page so generic pages update-->
</template>