<template>
  <div class="snake-game">
    <div class="game-header">
      <div class="score-board">
        <div class="score">得分: {{ score }}</div>
        <div class="high-score">最高分: {{ highScore }}</div>
      </div>
      <div class="game-status">{{ statusText }}</div>
    </div>
    
    <div class="game-board" :style="{ width: gridSize * cellSize + 'px', height: gridSize * cellSize + 'px' }">
      <div 
        v-for="y in gridSize" 
        :key="y"
        class="grid-row"
        :style="{ height: cellSize + 'px' }"
      >
        <div
          v-for="x in gridSize"
          :key="x"
          class="grid-cell"
          :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
          :class="getCellClass(x - 1, y - 1)"
        ></div>
      </div>
      
      <!-- 蛇身 -->
      <div
        v-for="(segment, index) in snake"
        :key="index"
        class="snake-segment"
        :class="{ 'snake-head': index === 0 }"
        :style="{
          left: segment.x * cellSize + 'px',
          top: segment.y * cellSize + 'px',
          width: cellSize + 'px',
          height: cellSize + 'px'
        }"
      ></div>
      
      <!-- 食物 -->
      <div
        class="food"
        :class="{ 'food-animation': foodAnimation }"
        :style="{
          left: food.x * cellSize + 'px',
          top: food.y * cellSize + 'px',
          width: cellSize + 'px',
          height: cellSize + 'px'
        }"
      ></div>
    </div>
    
    <div class="game-controls">
      <button 
        v-if="gameStatus === 'READY' || gameStatus === 'GAME_OVER'"
        @click="startGame"
        class="btn btn-start"
        :class="{ 'bounce-in': gameStatus === 'READY' || gameStatus === 'GAME_OVER' }"
      >
        {{ gameStatus === 'GAME_OVER' ? '重新开始' : '开始游戏' }}
      </button>
      
      <template v-else>
        <button 
          v-if="gameStatus === 'PLAYING'"
          @click="pauseGame"
          class="btn btn-pause"
        >
          暂停
        </button>
        
        <button 
          v-if="gameStatus === 'PAUSED'"
          @click="resumeGame"
          class="btn btn-resume"
        >
          继续
        </button>
        
        <button 
          @click="restartGame"
          class="btn btn-restart"
        >
          重新开始
        </button>
      </template>
    </div>
    
    <div class="game-instructions">
      <p>使用方向键控制蛇的移动，空格键暂停/继续</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useSnakeGame } from '../composables/useSnakeGame'
import { GameStatus } from '../types'
import anime from 'animejs/lib/anime.es.js'

export default defineComponent({
  name: 'SnakeGame',
  setup() {
    const {
      gameStatus,
      score,
      highScore,
      snake,
      food,
      direction,
      startGame,
      pauseGame,
      resumeGame,
      restartGame,
      changeDirection
    } = useSnakeGame()
    
    // 食物动画状态
    const foodAnimation = ref(false)
    
    // 网格配置
    const gridSize = 20
    const cellSize = 20
    
    // 状态文本
    const statusText = computed(() => {
      switch (gameStatus.value) {
        case GameStatus.READY:
          return '准备开始'
        case GameStatus.PLAYING:
          return '游戏中'
        case GameStatus.PAUSED:
          return '已暂停'
        case GameStatus.GAME_OVER:
          return '游戏结束'
        default:
          return ''
      }
    })
    
    // 获取单元格类名
    const getCellClass = (x: number, y: number) => {
      // 检查是否是蛇身
      if (snake.value && snake.value.some(segment => segment.x === x && segment.y === y)) return ''
      
      // 检查是否是食物
      if (food.value && food.value.x === x && food.value.y === y) return ''
      
      // 普通网格背景
      return 'grid-cell-bg'
    }
    
    // 监听食物变化，触发动画
    watch(() => food.value, () => {
      foodAnimation.value = true
      setTimeout(() => {
        foodAnimation.value = false
      }, 300)
    }, { deep: true })
    
    // 游戏开始动画
    const animateStart = () => {
      anime({
        targets: '.snake-segment',
        scale: [0, 1],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeInOutQuad'
      })
    }
    
    // 蛇移动动画
    const animateSnake = () => {
      anime({
        targets: '.snake-segment',
        translateX: (el: HTMLElement) => {
          const left = parseInt(el.style.left) || 0
          return left
        },
        translateY: (el: HTMLElement) => {
          const top = parseInt(el.style.top) || 0
          return top
        },
        duration: 150,
        easing: 'linear'
      })
    }
    
    // 食物被吃动画
    const animateFoodEaten = () => {
      anime({
        targets: '.food',
        scale: [1, 0],
        duration: 300,
        easing: 'easeInQuad'
      })
    }
    
    return {
      // 数据
      gameStatus,
      score,
      highScore,
      snake,
      food,
      direction,
      gridSize,
      cellSize,
      statusText,
      foodAnimation,
      
      // 方法
      startGame,
      pauseGame,
      resumeGame,
      restartGame,
      changeDirection,
      getCellClass
    }
  }
})
</script>

<style scoped>
.snake-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.game-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 420px;
  margin-bottom: 20px;
  animation: fadeInDown 1s ease-out;
}

.score-board {
  display: flex;
  gap: 20px;
}

.score, .high-score {
  font-weight: bold;
  font-size: 18px;
  animation: pulse 2s infinite;
}

.game-status {
  font-size: 18px;
  font-weight: bold;
  color: #42b983;
  animation: bounce 2s infinite;
}

.game-board {
  position: relative;
  border: 2px solid #333;
  background-color: #f0f0f0;
  margin-bottom: 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  animation: fadeIn 1s ease-out;
}

.grid-row {
  display: flex;
}

.grid-cell {
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.grid-cell-bg {
  background-color: #fff;
}

.snake-segment {
  position: absolute;
  background-color: #42b983;
  border: 1px solid #2e8a5f;
  border-radius: 2px;
  box-sizing: border-box;
  transform-origin: center;
}

.snake-head {
  background-color: #35495e;
  border-radius: 4px;
  z-index: 10;
}

.food {
  position: absolute;
  background-color: #ff6b6b;
  border-radius: 50%;
  box-sizing: border-box;
  transform-origin: center;
}

.food-animation {
  animation: pulse 0.5s ease-in-out;
}

.game-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-start {
  background-color: #42b983;
  color: white;
}

.btn-pause {
  background-color: #f6a82c;
  color: white;
}

.btn-resume {
  background-color: #42b983;
  color: white;
}

.btn-restart {
  background-color: #35495e;
  color: white;
}

.game-instructions {
  text-align: center;
  color: #666;
  font-size: 14px;
  animation: fadeInUp 1s ease-out;
}

/* 动画关键帧 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.bounce-in {
  animation: bounceIn 1s;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>