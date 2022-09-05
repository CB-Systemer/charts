import p5 from 'p5';
import { Circle } from './circle';
import { XCalc } from './xcalc';

export interface SwimlaneData {
  label: string;
  x: number;
  y: number;
  height: number;
  marginX: number;
  xcalc: XCalc;
  d: number;
  data: {
    x: number;
    value: string;
  }[];
}

export class Swimlane {
  p: p5;
  data: SwimlaneData;

  c: Circle[] | undefined = undefined;

  constructor(p: p5, data: SwimlaneData) {
    this.p = p;
    this.data = data;

    this.c = this.data.data.map(
      x =>
        new Circle(this.p, {
          x: this.data.xcalc.positions[x.x].x,
          y: this.data.y + this.data.height / 2,
          d: this.data.d,
          mouseD: this.data.d,
          label: x.value,
        }),
    );
  }

  public draw(x: number, y: number) {
    this.p.fill(240);
    this.p.strokeWeight(0.1);

    this.c.forEach(i => {
      this.p.fill(60, 60, 60, 30);
      this.p.strokeWeight(0);
      this.p.rect(i.data.x - this.data.d / 2, 0, this.data.d, this.data.y + this.data.d);
      this.p.fill(255);
      this.p.strokeWeight(1);
      i.draw(x, y);
    });
  }

  public isMouseOver(_: number, __: number) {
    return false;
  }
}
