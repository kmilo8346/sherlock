export interface ICollection<T> {
  total: number;
  from: number;
  size: number;
  data: T[];
}
