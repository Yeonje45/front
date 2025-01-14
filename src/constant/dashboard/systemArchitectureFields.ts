export interface IChildren {
  level: number;
  name: string;
  memo: string;
  children: IChildren[];
}