<script setup lang="ts">

import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutFixed from './components/LayoutFixed.vue'

// 获取导航数据
import { useCategoryStore } from '../../stores/categoryStore'
import { onMounted } from 'vue'
const categoryStore = useCategoryStore()
onMounted(() => categoryStore.getCategory())
</script>

<template>
  <LayoutFixed />
  <LayoutNav />
  <LayoutHeader />
  <!-- 强制刷新整个组件 -->
  <!-- <RouterView :key="$route.fullPath"/> -->
  <RouterView/>
  <LayoutFooter />
</template>