import p5 from 'p5';
import { Block } from './block';
import { Square } from './square';

export interface SwimlaneData {
  label: string;
  x: number;
  y: number;
  height: number;
  marginX: number;
  d: number;
  squares:
    | {
        x: number;
        value: string;
        fill: p5.Color;
        stroke: p5.Color;
        cornerRadius: number;
        gradientTop: p5.Color;
        gradientBottom: p5.Color;
      }[]
    | undefined;
  blocks:
    | {
        x1: number;
        x2: number;
        label: string;
        fill: p5.Color;
        stroke: p5.Color;
        cornerRadius: number;
        gradientTop: p5.Color;
        gradientBottom: p5.Color;
      }[]
    | undefined;
}

export class Swimlane {
  p: p5;
  data: SwimlaneData;

  squares: Square[] | undefined = undefined;
  blocks: Block[] | undefined = undefined;

  constructor(p: p5, data: SwimlaneData) {
    this.p = p;
    this.data = data;

    this.squares =
      this.data.squares?.map(
        x =>
          new Square(this.p, {
            x: x.x,
            y: this.data.y + this.data.height / 2,
            d: this.data.d,
            fill: x.fill,
            stroke: x.stroke,
            cornerRadius: x.cornerRadius,
            mouseD: this.data.d,
            label: x.value,
          }),
      ) ?? [];

    this.blocks =
      this.data.blocks?.map(
        x =>
          new Block(this.p, {
            x: x.x1,
            width: x.x2 - x.x1,
            y: this.data.y,
            height: this.data.d,
            marginTop: (this.data.height - this.data.d) / 2,
            label: x.label,
            mouseD: this.data.d,
            stroke: x.stroke,
            fill: x.fill,
            cornerRadius: x.cornerRadius,
          }),
      ) ?? [];
  }

  public draw(x: number, y: number) {
    this.p.fill(240);
    this.p.strokeWeight(0.1);

    this.squares.forEach((square, index) => {
      this.p.strokeWeight(1);
      this.p.noFill();

      for (let i = 0; i <= square.data.y + square.data.cornerRadius; i++) {
        const inter = this.p.map(i, 0, square.data.y, 0, 1);
        const c = this.p.lerpColor(this.data.squares[index].gradientTop, this.data.squares[index].gradientBottom, inter);
        this.p.stroke(c);
        this.p.line(square.data.x - this.data.d / 2, i, square.data.x + square.data.d / 2, i);
      }

      this.p.fill(255);
      this.p.strokeWeight(1);
      square.draw(x, y);
    });

    this.blocks.forEach((block, index) => {
      this.p.strokeWeight(1);
      this.p.noFill();

      for (let i = 0; i <= block.getY() + block.data.cornerRadius; i++) {
        const inter = this.p.map(i, 0, block.getY(), 0, 1);
        const c = this.p.lerpColor(this.data.blocks[index].gradientTop, this.data.blocks[index].gradientBottom, inter);
        this.p.stroke(c);
        this.p.line(block.data.x, i, block.data.x + block.data.width, i);
      }

      this.p.fill(255);
      this.p.strokeWeight(1);
      block.draw(x, y);
    });
  }

  public isMouseOver(_: number, __: number) {
    return false;
  }
}
