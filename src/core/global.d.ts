declare interface MouseUIEvent extends MouseEvent {
  region: string;
}

declare interface Dict<T = any> {
  [key: string]: T,
}

declare interface Math {
  clamp: (min: number, max: number, value: number) => number;
}