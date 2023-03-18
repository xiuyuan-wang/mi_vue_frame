<template>
  {{state.count}}{{count}}
  <img alt="Vue logo" @click="handerclick" src="./assets/logo.svg">
  <!-- 父组件 -->
  <MyButton type="primary"> 
        <template #default>按钮</template>
    <template #icon>111</template>
    <template #footer>ceshi</template>
  </MyButton>

  


  <HelloWorld :paremnt="state.count" msg="Welcome 3344444444 to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import MyButton from './components/MyButton.vue';
let num = { count: 0 }
let state = reactive(num)
const count = ref(0)
const handerclick = () => {
  state.count ++
  count.value ++
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  img{
    width: 200px;
  }
}
</style>
