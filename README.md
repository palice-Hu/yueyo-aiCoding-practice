# yueyo-aiCoding-practice

这是一个使用 Vue3 和 TypeScript 开发的贪吃蛇游戏项目。

## 项目介绍

贪吃蛇是一款经典的游戏，玩家通过控制蛇的移动方向来吃食物，每吃到一个食物蛇身就会增长，同时得分增加。游戏的目标是让蛇尽可能长，直到撞到墙壁或自身导致游戏结束。

## 技术栈

- Vue 3 (Composition API)
- TypeScript
- HTML5/CSS3

## 项目结构

```
src/
├── components/
│   └── SnakeGame.vue      # 游戏主组件
├── composables/
│   └── useSnakeGame.ts    # 游戏逻辑组合式函数
├── types/
│   └── index.ts           # 类型定义文件
└── App.vue                # 根组件
```

## 功能特性

- 经典贪吃蛇游戏玩法
- 键盘方向键控制
- 实时得分显示
- 最高分记录
- 响应式设计

## PRD 文档

详细的产品需求文档请查看 [SNAKE_GAME_PRD.md](SNAKE_GAME_PRD.md)
