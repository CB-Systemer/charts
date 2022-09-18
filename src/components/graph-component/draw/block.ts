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
  labelTextSize: number;
}

export class Block {
  p: p5;
  data: BlockData;

  constructor(p: p5, data: BlockData) {
    this.p = p;
    this.data = data;
  }

  public draw(x: number, y: number) {
    this.p.fill(this.data.fill);
    this.p.stroke(this.data.stroke);
    this.p.strokeWeight(1);
    this.p.rect(this.data.x, this.getY(), this.data.width, this.data.height, this.data.cornerRadius);

    if (this.isMouseOver(x, y)) {
      if (this.data.label) {
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
