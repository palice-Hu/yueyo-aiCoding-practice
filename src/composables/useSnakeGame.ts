import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Direction, Point, GameStatus } from '../types'

// 游戏配置
const GRID_SIZE = 20
const INITIAL_SPEED = 150

export function useSnakeGame() {
  // 游戏状态
  const gameStatus = ref<GameStatus>(GameStatus.READY)
  
  // 得分
  const score = ref(0)
  const highScore = ref(0)
  
  // 蛇
  const snake = reactive<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ])
  
  // 食物
  const food = reactive<Point>({ x: 5, y: 5 })
  
  // 食物被吃动画触发
  const foodEaten = ref(false)
  
  // 方向
  const direction = ref<Direction>(Direction.RIGHT)
  const nextDirection = ref<Direction>(Direction.RIGHT)
  
  // 速度控制
  let gameTimer: number | null = null
  
  // 生成随机食物
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    
    // 确保食物不会生成在蛇身上
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    )
    
    if (isOnSnake) {
      generateFood()
    } else {
      food.x = newFood.x
      food.y = newFood.y
    }
  }
  
  // 初始化游戏
  const initGame = () => {
    // 重置蛇的位置
    snake.length = 0
    snake.push({ x: 10, y: 10 })
    snake.push({ x: 9, y: 10 })
    snake.push({ x: 8, y: 10 })
    
    // 重置方向
    direction.value = Direction.RIGHT
    nextDirection.value = Direction.RIGHT
    
    // 重置得分
    score.value = 0
    
    // 生成食物
    generateFood()
    
    // 设置游戏状态
    gameStatus.value = GameStatus.READY
  }
  
  // 移动蛇
  const moveSnake = () => {
    // 更新方向
    direction.value = nextDirection.value
    
    // 获取蛇头
    const head = { ...snake[0] }
    
    // 根据方向移动蛇头
    switch (direction.value) {
      case Direction.UP:
        head.y -= 1
        break
      case Direction.DOWN:
        head.y += 1
        break
      case Direction.LEFT:
        head.x -= 1
        break
      case Direction.RIGHT:
        head.x += 1
        break
    }
    
    // 检查是否撞墙
    if (
      head.x < 0 || 
      head.x >= GRID_SIZE || 
      head.y < 0 || 
      head.y >= GRID_SIZE
    ) {
      gameOver()
      return
    }
    
    // 检查是否撞到自己
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      gameOver()
      return
    }
    
    // 将新头添加到蛇身上
    snake.unshift(head)
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
      // 增加得分
      score.value += 10
      
      // 更新最高分
      if (score.value > highScore.value) {
        highScore.value = score.value
        // 保存最高分到本地存储
        localStorage.setItem('snakeHighScore', highScore.value.toString())
      }
      
      // 触发动画
      foodEaten.value = true
      
      // 生成新食物
      generateFood()
      
      // 重置动画触发（实际动画由组件处理）
    } else {
      // 没吃到食物则移除尾巴
      snake.pop()
    }
  }
  
  // 开始游戏
  const startGame = () => {
    if (gameStatus.value === GameStatus.PLAYING) return
    
    if (gameStatus.value === GameStatus.GAME_OVER) {
      initGame()
    }
    
    gameStatus.value = GameStatus.PLAYING
    
    // 开始游戏循环
    if (gameTimer) clearInterval(gameTimer)
    gameTimer = window.setInterval(moveSnake, INITIAL_SPEED)
  }
  
  // 暂停游戏
  const pauseGame = () => {
    if (gameStatus.value !== GameStatus.PLAYING) return
    
    gameStatus.value = GameStatus.PAUSED
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
  }
  
  // 继续游戏
  const resumeGame = () => {
    if (gameStatus.value !== GameStatus.PAUSED) return
    
    gameStatus.value = GameStatus.PLAYING
    if (gameTimer) clearInterval(gameTimer)
    gameTimer = window.setInterval(moveSnake, INITIAL_SPEED)
  }
  
  // 结束游戏
  const gameOver = () => {
    gameStatus.value = GameStatus.GAME_OVER
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
  }
  
  // 重新开始游戏
  const restartGame = () => {
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
    initGame()
    startGame()
  }
  
  // 改变方向
  const changeDirection = (newDirection: Direction) => {
    // 防止反向移动
    if (
      (direction.value === Direction.UP && newDirection === Direction.DOWN) ||
      (direction.value === Direction.DOWN && newDirection === Direction.UP) ||
      (direction.value === Direction.LEFT && newDirection === Direction.RIGHT) ||
      (direction.value === Direction.RIGHT && newDirection === Direction.LEFT)
    ) {
      return
    }
    
    nextDirection.value = newDirection
  }
  
  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        changeDirection(Direction.UP)
        break
      case 'ArrowDown':
        changeDirection(Direction.DOWN)
        break
      case 'ArrowLeft':
        changeDirection(Direction.LEFT)
        break
      case 'ArrowRight':
        changeDirection(Direction.RIGHT)
        break
      case ' ':
        if (gameStatus.value === GameStatus.PLAYING) {
          pauseGame()
        } else if (gameStatus.value === GameStatus.PAUSED) {
          resumeGame()
        } else if (gameStatus.value === GameStatus.READY || gameStatus.value === GameStatus.GAME_OVER) {
          startGame()
        }
        break
    }
  }
  
  // 加载最高分
  const loadHighScore = () => {
    const savedHighScore = localStorage.getItem('snakeHighScore')
    if (savedHighScore) {
      highScore.value = parseInt(savedHighScore, 10)
    }
  }
  
  // 初始化
  onMounted(() => {
    loadHighScore()
    window.addEventListener('keydown', handleKeyDown)
  })
  
  // 清理
  onUnmounted(() => {
    if (gameTimer) {
      clearInterval(gameTimer)
    }
    window.removeEventListener('keydown', handleKeyDown)
  })
  
  return {
    // 状态
    gameStatus,
    score,
    highScore,
    snake,
    food,
    direction,
    foodEaten,
    
    // 方法
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
    initGame
  }
}