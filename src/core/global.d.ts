declare interface MouseUIEvent extends MouseEvent {
  region: string;
}

declare interface Dict<T> {
  [key: string]: T,
}