import p5 from 'p5';

export interface CircleData {
  x: number;
  y: number;
  d: number;
  mouseD: number;
  label: string;
}

export class Circle {
  p: p5;
  data: CircleData;
  i: number;

  constructor(p: p5, data: CircleData) {
    this.p = p;
    this.data = data;
    this.i = this.data.d;
  }

  public draw(x: number, y: number) {
    this.p.fill(255);
    this.p.strokeWeight(1);
    if (this.isMouseOver(x, y)) {
      if (this.i < this.data.d * 1.5) {
        this.i++;
      }
      this.p.circle(this.data.x, this.data.y, this.i);
      if (this.data.label) {
        this.p.fill(0);
        this.p.strokeWeight(0);
        this.p.stroke(0);
        this.p.text(this.data.label, x, y - 10);
      }
    } else {
      if (this.i > this.data.d) {
        this.i--;
      }
      this.p.circle(this.data.x, this.data.y, this.i);
    }
  }

  public isMouseOver(x: number, y: number) {
    const disX = this.data.x - x;
    const disY = this.data.y - y;
    if (this.p.sqrt(this.p.sq(disX) + this.p.sq(disY)) < this.data.mouseD / 2) {
      return true;
    } else {
      return false;
    }
  }
}
