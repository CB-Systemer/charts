import p5 from 'p5';
import { XCalc } from './xcalc';

export interface XAxisData {
  marginX: number;
  marginB: number;
  xcalc: XCalc;
}

export class XAxis {
  p: p5;
  data: XAxisData;
  i: number;

  constructor(p: p5, data: XAxisData) {
    this.p = p;
    this.data = data;
  }

  public draw() {
    const y = this.p.height - this.data.marginB;

    this.p.strokeWeight(1);
    this.p.line(this.data.xcalc.positions.at(0).x, y, this.data.xcalc.positions.at(-1).x, y);

    for (let index = 0; index < this.data.xcalc.positions.length; index++) {
      const element = this.data.xcalc.positions[index];
      if (element.hasMark) {
        this.p.strokeWeight(1);
        this.p.line(element.x, y, element.x, y + 5);
        const dateSize = this.p.textWidth(element.label);
        let dateX = element.x;
        if (index === 0) {
        } else if (index === this.data.xcalc.positions.length - 1) {
          dateX = dateX - dateSize;
        } else {
          dateX = dateX - dateSize / 2;
        }
        // this.p.font() = '12px Arial';
        this.p.fill(0, 0, 0);

        this.p.strokeWeight(0);
        this.p.text(element.label, dateX, y + 8);
      }
    }
  }
}
