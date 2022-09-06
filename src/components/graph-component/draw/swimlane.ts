import p5 from 'p5';
import { Block } from './block';
import { Circle } from './circle';

export interface SwimlaneData {
  label: string;
  x: number;
  y: number;
  height: number;
  marginX: number;
  d: number;
  circles: {
    x: number;
    value: string;
  }[];
  blocks: {
    x1: number;
    x2: number;
    label: string;
  }[];
}

export class Swimlane {
  p: p5;
  data: SwimlaneData;

  circles: Circle[] | undefined = undefined;
  blocks: Block[] | undefined = undefined;

  constructor(p: p5, data: SwimlaneData) {
    this.p = p;
    this.data = data;

    this.circles =
      this.data.circles?.map(
        x =>
          new Circle(this.p, {
            x: x.x,
            y: this.data.y + this.data.height / 2,
            d: this.data.d,
            mouseD: this.data.d,
            label: x.value,
          }),
      ) ?? [];

    this.blocks =
      this.data.blocks?.map(
        x =>
          new Block(this.p, {
            x1: x.x1,
            w: x.x2 - x.x1,
            y: this.data.y,
            d: this.data.d,
            label: x.label,
            mouseD: this.data.d,
          }),
      ) ?? [];
  }

  public draw(x: number, y: number) {
    this.p.fill(240);
    this.p.strokeWeight(0.1);

    this.circles.forEach(i => {
      this.p.fill(60, 60, 60, 30);
      this.p.strokeWeight(0);
      this.p.rect(i.data.x - this.data.d / 2, 0, this.data.d, this.data.y + this.data.d);
      this.p.fill(255);
      this.p.strokeWeight(1);
      i.draw(x, y);
    });

    this.blocks.forEach(i => {
      this.p.fill(60, 60, 60, 30);
      this.p.strokeWeight(0);
      this.p.rect(i.data.x1, 0, i.data.w, i.getY() + i.data.d);
      this.p.fill(255);
      this.p.strokeWeight(1);
      i.draw(x, y);
    });
  }

  public isMouseOver(_: number, __: number) {
    return false;
  }
}
