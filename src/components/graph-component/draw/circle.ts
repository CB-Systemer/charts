import p5 from 'p5';

export interface CircleData {
  x: number;
  y: number;
  d: number;
  mouseD: number;
  label: string;
  labelTextSize: number;
}

export class Circle {
  p: p5;
  data: CircleData;

  constructor(p: p5, data: CircleData) {
    this.p = p;
    this.data = data;
  }

  public draw() {
    this.p.fill(6, 95, 70);
    this.p.stroke(6, 95, 70);
    this.p.strokeWeight(1);
    this.p.circle(this.data.x, this.data.y, this.data.d);
  }

  public drawLabel(x: number, y: number) {
    if (this.isMouseOver(x, y)) {
      if (this.data.label) {
        this.p.strokeWeight(1);
        this.p.stroke(100);

        this.p.fill(255);
        this.p.textSize(this.data.labelTextSize);
        const width = this.p.textWidth(this.data.label);

        this.p.rect(x - (width + 10) / 2, y - this.p.textAscent() - 10, width + 10, this.p.textAscent() + this.p.textDescent() + 5, 5, 5, 5, 5);

        this.p.strokeWeight(0);
        this.p.fill(0);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(this.data.label, x, y - 10);
      }
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
