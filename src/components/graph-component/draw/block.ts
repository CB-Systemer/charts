import p5 from 'p5';

export interface CircleData {
  x1: number;
  w: number;
  y: number;
  d: number;
  mouseD: number;
  label: string;
}

export class Block {
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
      this.p.rect(this.data.x1, this.getY(), this.data.w, this.data.d);
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
      this.p.rect(this.data.x1, this.getY(), this.data.w, this.data.d);
    }
  }

  public getY() {
    return this.data.y + this.data.d / 2;
  }

  public isMouseOver(x: number, y: number) {
    const r = x > this.data.x1 && x < this.data.x1 + this.data.w && y > this.getY() && y < this.getY() + this.data.d;
    console.log('isMouseOver?', r, x, y, this.data, this.getY());

    return r;
  }
}
