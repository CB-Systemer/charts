import p5 from 'p5';

export interface BlockData {
  x: number;
  width: number;
  y: number;
  height: number;
  marginTop: number;
  mouseD: number;
  label: string;
  fill: p5.Color;
  stroke: p5.Color;
  cornerRadius: number;
}

export class Block {
  p: p5;
  data: BlockData;
  i: number;

  constructor(p: p5, data: BlockData) {
    this.p = p;
    this.data = data;
    this.i = this.data.height;
  }

  public draw(x: number, y: number) {
    this.p.fill(this.data.fill);
    this.p.stroke(this.data.stroke);
    this.p.strokeWeight(1);
    if (this.isMouseOver(x, y)) {
      if (this.i < this.data.height * 1.5) {
        this.i++;
      }
      this.p.rect(this.data.x, this.getY(), this.data.width, this.data.height, this.data.cornerRadius);
      if (this.data.label) {
        this.p.fill(0);
        this.p.strokeWeight(0);
        this.p.stroke(0);
        this.p.text(this.data.label, x, y - 10);
      }
    } else {
      if (this.i > this.data.height) {
        this.i--;
      }
      this.p.rect(this.data.x, this.getY(), this.data.width, this.data.height, this.data.cornerRadius);
    }
  }

  public getY() {
    return this.data.y + this.data.marginTop;
  }

  public isMouseOver(x: number, y: number) {
    const r = x > this.data.x && x < this.data.x + this.data.width && y > this.getY() && y < this.getY() + this.data.height;
    return r;
  }
}
