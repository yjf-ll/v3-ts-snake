import { reactive, ref } from "vue";
import { UnwrapNestedRefs, Ref, UnwrapRef } from "@vue/reactivity";

export enum DirectionType {
  top,
  right,
  bottom,
  left,
}

interface GameUnit {
  x: number;
  y: number;
}

interface SnakeConfig {
  size: number;
  direction: DirectionType;
  headerColor: string;
  bodyColor: string;
}

class Snake {
  private config: SnakeConfig;
  direction: DirectionType;
  body: UnwrapNestedRefs<GameUnit[]> = reactive([]);
  constructor(
    config: SnakeConfig = {
      size: 5,
      direction: DirectionType.right,
      headerColor: "red",
      bodyColor: "red",
    }
  ) {
    this.config = config;
    this.direction = config.direction;
    this.onInit();
  }
  onInit = () => {
    //  根据配置生成snake的长度
    while (this.body.length > 0) {
      this.body.pop();
    }
    for (let i = this.config.size - 1; i >= 0; --i) {
      this.body.push({ x: 0, y: i });
    }
  };
  get snakeHeader(): GameUnit {
    return this.body[0];
  }
  get snakeFooter(): GameUnit {
    return this.body[this.body.length - 1];
  }
  onRefresh = () => {
    const { x, y } = this.snakeHeader;
    if (this.direction === DirectionType.top) {
      this.body.unshift({ x, y: y - 1 });
      this.body.pop();
    }
    if (this.direction === DirectionType.right) {
      this.body.unshift({ x: x + 1, y });
      this.body.pop();
    }
    if (this.direction === DirectionType.bottom) {
      this.body.unshift({ x, y: y + 1 });
      this.body.pop();
    }
    if (this.direction === DirectionType.left) {
      this.body.unshift({ x: x - 1, y });
      this.body.pop();
    }
    console.log("refresh", this.body);
  };
  onEatFood = () => {
    const { x, y } = this.snakeFooter;
    if (this.direction === DirectionType.top) {
      this.body.push({ x, y: y - 1 });
    }
    if (this.direction === DirectionType.right) {
      this.body.push({ x: x - 1, y });
    }
    if (this.direction === DirectionType.bottom) {
      this.body.push({ x, y: y + 1 });
    }
    if (this.direction === DirectionType.left) {
      this.body.push({ x: x + 1, y });
    }
    console.log("refresh", this.body);
  };
  onChangeDirection = (direction: DirectionType) => {
    if (
      this.direction === DirectionType.left &&
      direction === DirectionType.right
    )
      return;
    if (
      this.direction === DirectionType.right &&
      direction === DirectionType.left
    )
      return;
    if (
      this.direction === DirectionType.top &&
      direction === DirectionType.bottom
    )
      return;
    if (
      this.direction === DirectionType.bottom &&
      direction === DirectionType.top
    )
      return;
    this.direction = direction;
  };
}

interface GameConfig {
  delay: number;
  mapWidth: number;
  mapHeight: number;
  size: number;
}

export class Game {
  snake: Snake;
  // food: GameUnit;
  food: UnwrapNestedRefs<GameUnit> = reactive({ x: 5, y: 10 });
  map: GameUnit;
  private timer?: number | null;
  private config: GameConfig;
  count: Ref<UnwrapRef<number>> = ref(0);

  constructor(
    config: GameConfig = { delay: 200, mapWidth: 500, mapHeight: 500, size: 2 }
  ) {
    this.config = config;
    this.snake = new Snake();
    this.map = { x: config.mapWidth, y: config.mapHeight };
  }
  onStart = () => {
    this.timer = setInterval(() => {
      this.snake.onRefresh();
      const flag = this.isCoincide();
      this.isOver();
      if (flag) {
        this.count.value++;
        this.snake.onEatFood();
        this.onRefreshFood();
      }
    }, this.config.delay);
  };
  onReset = () => {
    this.onCancel();
    this.onStart();
  };
  onStop = () => {
    console.log(this.timer);
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
  onCancel = () => {
    this.onStop();
    this.snake.onInit();
  };
  onRefreshFood = () => {
    this.food.x = getRandomIntInclusive(0, this.config.mapWidth / 20 - 1);
    this.food.y = getRandomIntInclusive(0, this.config.mapWidth / 20 - 1);
  };
  onChangeDirection = (direction: DirectionType) => {
    this.snake.onChangeDirection(direction);
  };
  private isCoincide = () => {
    return this.snake.body.some((el) => {
      return el.x === this.food.x && el.y === this.food.y;
    });
  };
  private isOver = () => {
    const flag = this.snake.body.some((el) => {
      return el.x > 24 || el.y > 24;
    });
    if (flag) {
      this.onStop();
    }
  };
}

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}
