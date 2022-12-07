<template>
  <div>
    {{ game.snake.body }}
    {{ game.snake.direction }}
    <div
      :style="`width: ${game.map.x}px;
      height: ${game.map.y}px;`"
      class="map"
    >
      <div
        v-for="(item, index) in game.snake.body"
        :key="index"
        :style="`top: ${item.y * 20}px;left: ${item.x * 20}px;background: ${
          index === 0 ? 'red' : 'blue'
        }`"
        class="snake-item"
      ></div>
      <div
        class="food"
        :style="`top: ${game.food.y * 20}px;left: ${game.food.x * 20}px;`"
      ></div>
    </div>
    <div><button @click="game.onStart">开始</button></div>
    <div><button @click="game.onStop">暂停</button></div>
    <div><button @click="game.onCancel">取消</button></div>
    <div><button @click="game.onReset">重置</button></div>
    <div>
      <button @click="game.onChangeDirection(DirectionType.top)">上</button>
    </div>
    <div>
      <button @click="game.onChangeDirection(DirectionType.bottom)">下</button>
    </div>
    <div>
      <button @click="game.onChangeDirection(DirectionType.left)">左</button>
    </div>
    <div>
      <button @click="game.onChangeDirection(DirectionType.right)">右</button>
    </div>
    <div>
      <button @click="game.onRefreshFood">刷新食物</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Game, DirectionType } from "@/utils";

const game = new Game();
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.map {
  background: yellow;
  position: relative;
}
.snake-item {
  width: 20px;
  height: 20px;
  background: aqua;
  position: absolute;
}
.food {
  width: 20px;
  height: 20px;
  background: green;
  position: absolute;
}
</style>
