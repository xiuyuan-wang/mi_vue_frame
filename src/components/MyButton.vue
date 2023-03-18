<template>
  <div class="item">
    2222
    <el-button v-bind="$attrs">
      <!-- 通过遍历实现插槽透传 -->
      <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
        <slot :name="key"></slot>
      </template>
    </el-button>
  </div>
</template>
