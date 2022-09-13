import p5 from 'p5';

export interface SquareData {
  x: number;
  y: number;
  d: number;
  fill: p5.Color;
  stroke: p5.Color;
  cornerRadius: number;
  mouseD: number;
  label: string;
  labelTextSize: number;
}

export class Square {
  p: p5;
  data: SquareData;

  constructor(p: p5, data: SquareData) {
    this.p = p;
    this.data = data;
  }

  public draw(x: number, y: number) {
    this.p.fill(this.data.fill);
    this.p.stroke(this.data.stroke);
    this.p.strokeWeight(1);

    this.p.rect(this.data.x - this.data.d / 2, this.data.y - this.data.d / 2, this.data.d, this.data.d, this.data.cornerRadius);

    if (this.isMouseOver(x, y)) {
      if (this.data.label) {
        this.p.textSize(this.data.labelTextSize);
        this.p.strokeWeight(1);
        this.p.stroke(100);

        this.p.fill(255);
        this.p.textSize(this.data.labelTextSize);
        const width = this.p.textWidth(this.data.label);

        this.p.rect(x - (width + 10) / 2, y - this.p.textAscent() - 10, width + 10, this.p.textAscent() + this.p.textDescent() + 5, 5, 5, 5, 5);

        this.p.fill(0);
        this.p.strokeWeight(0);
        this.p.stroke(0);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(this.data.label, x, y - 10);
      }
    } else {
      if (this.data.label) {
        this.p.strokeWeight(0);
        this.p.stroke(0);
        this.p.fill(255);
        this.p.textSize(12);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(this.data.label, this.data.x, this.data.y);
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
