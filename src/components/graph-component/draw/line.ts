import p5 from 'p5';

export interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class Line {
  p: p5;
  data: LineData;
  i: number;

  constructor(p: p5, data: LineData) {
    this.p = p;
    this.data = data;
  }

  public draw(_: number, __: number) {
    this.p.stroke(100);
    this.p.strokeWeight(2);
    this.p.line(this.data.x1, this.data.y1, this.data.x2, this.data.y2);
  }

  public isMouseOver(_: number, __: number) {}
}
