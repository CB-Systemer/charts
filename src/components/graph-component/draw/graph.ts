import p5 from 'p5';
import { Circle } from './circle';
import { Line } from './line';
import { Swimlane } from './swimlane';
import { XAxis } from './x-axis';
import { XCalc, YCalc } from './xcalc';

export interface GraphOptions {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  spaceGraphSwimlanes: number;
  swimlaneHeight: number;
  xAxisFormatter: (graphData: GraphData) => string;
}

export interface GraphData {
  id: string;
  date: Date;
  value: number;
}

export interface GraphSwimlaneData {
  label: string;
  circles: {
    x: number;
    value: string;
  }[];
  blocks: {
    x1: number;
    x2: number;
    label: string;
  }[];
}

export class Graph {
  private _parent: HTMLElement;
  private _p: p5;
  private _rezizeObserver: ResizeObserver;
  private _options: GraphOptions;

  private graphData: GraphData[];
  private swimlaneData: GraphSwimlaneData[];

  private xcalc: XCalc;
  private ycalc: YCalc;

  constructor(parent: HTMLElement, options: GraphOptions, graphData: GraphData[], swimlaneData: GraphSwimlaneData[]) {
    this._parent = parent;
    this._options = options ?? {
      marginTop: 20,
      marginRight: 10,
      marginBottom: 20,
      marginLeft: 10,
      spaceGraphSwimlanes: 30,
      swimlaneHeight: 20,
      xAxisFormatter: graphData => graphData.date.toLocaleDateString(),
    };
    this.graphData = graphData;
    this.swimlaneData = swimlaneData;

    this.setup();
    this.calcAndFill();

    this._p.draw = this.draw;
  }

  setup = () => {
    this._p = new p5(() => {
      // We setup
    }, this._parent);

    this._p.createCanvas(this._parent.getBoundingClientRect().width, this._parent.getBoundingClientRect().height);

    this.setupResize();
  };

  calcAndFill = () => {
    this.calc();
    this.fillCircles();
    this.fillGraphYLines();
    this.fillSwimlanes();
    this.fillX();
  };

  calc = () => {
    this.calcX();
    this.calcY();
  };

  calcX = () => {
    const maxSwimlaneLabelWidth = this.swimlaneData.map(x => x.circles.map(y => this._p.textWidth(y.value)).reduce((a, b) => Math.max(a, b))).reduce((p, c) => Math.max(p, c));
    const graphMarginL = maxSwimlaneLabelWidth + this._options.marginLeft;

    const widthBetween = (this._parent.getBoundingClientRect().width - (graphMarginL + this._options.marginRight)) / (this.graphData.length - 1);
    const split = Math.round(this.graphData.length / 3);
    this.xcalc = {
      graphMarginL,
      positions: [...new Array(this.graphData.length).keys()].map(x => ({
        x: graphMarginL + x * widthBetween,
        hasMark: x % split === 0 || x === this.graphData.length - 1,
        label: this._options.xAxisFormatter(this.graphData[x]),
      })),
    };
  };

  calcY = () => {
    const marginBWithSwimlanes = this._options.spaceGraphSwimlanes + this.swimlaneData.length * this._options.swimlaneHeight + this._options.marginBottom;

    const availableHeightForGraph = this._p.height - this._options.marginTop - marginBWithSwimlanes;
    const maxValue = this.graphData.map(x => x.value).reduce((p, c) => Math.max(p, c));
    const minValue = 0;
    const middleValue = (maxValue - minValue) / 2;

    const graphMaxValue = Math.round(maxValue * 1);
    const bottomLine = this._options.marginTop + availableHeightForGraph;
    const topLine = this._options.marginTop;
    const middleLine = Math.round((bottomLine - topLine) / 2) + this._options.marginTop;

    const lineLabels = [maxValue.toString(), middleValue.toString(), minValue.toString()];
    const maxLineLabelsWidth = lineLabels.map(x => this._p.textWidth(x)).reduce((p, c) => Math.max(p, c));

    const h = availableHeightForGraph / graphMaxValue;

    this.ycalc = {
      height: h,
      marginBWithSwimlanes,
      maxLineLabelsWidth,
      lineLabels,
      graphLines: [topLine, middleLine, bottomLine],
      swimLanes: this.swimlaneData.map((_, i) => this._p.height - marginBWithSwimlanes + this._options.spaceGraphSwimlanes + this._options.swimlaneHeight * i),
    };
  };

  graphCircles: Circle[];
  graphLines: Line[];
  swimlanes: Swimlane[];
  xAxis: XAxis;

  fillCircles = () => {
    this.graphCircles = this.graphData.map(
      (x, i) =>
        new Circle(this._p, {
          x: this.xcalc.positions[i].x,
          y: this._p.height - x.value * this.ycalc.height - this.ycalc.marginBWithSwimlanes,
          d: 3,
          mouseD: 20,
          label: x.value.toString(),
        }),
    );
  };

  fillGraphYLines = () => {
    this.graphLines = [];
    this.graphCircles.forEach((_, i) => {
      if (i === 0) return;

      this.graphLines.push(
        new Line(this._p, {
          x1: this.graphCircles[i - 1].data.x,
          y1: this.graphCircles[i - 1].data.y,
          x2: this.graphCircles[i].data.x,
          y2: this.graphCircles[i].data.y,
        }),
      );
    });
  };

  fillSwimlanes = () => {
    this.swimlanes = this.swimlaneData.map(
      (x, i) =>
        new Swimlane(this._p, {
          label: x.label,
          xcalc: this.xcalc,
          x: this.xcalc.graphMarginL,
          y: this.ycalc.swimLanes[i],
          height: this._options.swimlaneHeight,
          d: 10,
          marginX: this.xcalc.graphMarginL,
          circles: x.circles,
          blocks: x.blocks,
        }),
    );
  };

  fillX = () => {
    this.xAxis = new XAxis(this._p, {
      marginX: this.xcalc.graphMarginL,
      marginB: this.ycalc.marginBWithSwimlanes,
      xcalc: this.xcalc,
    });
  };

  canvasWidth: number;
  canvasHeight: number;
  mouseX: number;
  mouseY: number;

  draw = () => {
    const isRedrawRequired = this.isRedrawRequired();
    if (!isRedrawRequired) {
      return;
    }

    this.mouseX = this._p.mouseX;
    this.mouseY = this._p.mouseY;

    this._p.background(this._p.color(240));
    this._p.textSize(12);
    this._p.textAlign(this._p.LEFT, this._p.TOP);

    var mx = this.mouseX;
    var my = this.mouseY;

    this.swimlanes.forEach(x => x.draw(mx, my));

    // this._p.stroke(0);
    // this._p.strokeWeight(0);
    this.xAxis.draw();

    this.drawOverlayAboveGraph();

    this._p.strokeWeight(1);
    this._p.textAlign(this._p.LEFT, this._p.CENTER);
    this.ycalc.graphLines.forEach((y, i) => {
      this._p.stroke(200);
      this._p.strokeWeight(1);
      this._p.line(this.ycalc.maxLineLabelsWidth + 20, y, this._p.width, y);
      this._p.strokeWeight(0);
      this._p.fill(0, 0, 0);
      this._p.text(this.ycalc.lineLabels[i], 10, y);
    });

    this.ycalc.swimLanes.forEach((y, i) => {
      this._p.stroke(200);
      this._p.strokeWeight(1);
      this._p.line(0, y, this._p.width, y);
      this._p.strokeWeight(0);
      this._p.fill(0, 0, 0);
      this._p.text(this.swimlaneData[i].label, 10, y + this._options.swimlaneHeight / 2);
    });

    this.graphLines.forEach(x => x.draw(mx, my));
    this.graphCircles.forEach(x => x.draw(mx, my));
  };

  isRedrawRequired = (): boolean => {
    let onDrawElement = false;

    // Has the canvas size changed?
    if (this.canvasWidth !== this._p.width || this.canvasHeight !== this._p.height) {
      this.canvasWidth = this._p.width;
      this.canvasHeight = this._p.height;

      console.log('Redraw: Canvas size changed');
      onDrawElement = true;
    }

    for (let index = 0; index < this.graphCircles.length; index++) {
      const element = this.graphCircles[index];
      if (element.isMouseOver(this._p.mouseX, this._p.mouseY)) {
        console.log('Redraw: Cursor is hovering a circle');
        onDrawElement = true;
        break;
      }
    }

    if (!onDrawElement && (this._p.mouseX < 0 || this._p.mouseX > this._p.width || this._p.mouseY < 0 || this._p.mouseY > this._p.height)) {
      return false;
    }

    if (!onDrawElement && this.mouseX === this._p.mouseX && this.mouseY === this._p.mouseY) {
      return false;
    }

    return true;
  };

  drawOverlayAboveGraph = () => {
    this._p.fill(240);
    this._p.stroke(255);
    this._p.strokeWeight(0);
    this._p.beginShape();
    this._p.vertex(0, 0);
    this._p.vertex(0, this.graphCircles.at(0).data.y);
    this.graphCircles.forEach(x => {
      this._p.vertex(x.data.x, x.data.y);
    });
    this._p.vertex(this._p.width, this.graphCircles.at(-1).data.y);
    this._p.vertex(this._p.width, 0);
    this._p.endShape(this._p.CLOSE);
  };

  resize = (width: number, height: number) => {
    this.calc();
    this.fillCircles();
    this.fillGraphYLines();
    this.fillSwimlanes();
    this.fillX();

    this._p.resizeCanvas(width, height);
  };

  setupResize = () => {
    this._rezizeObserver = new ResizeObserver(entities => {
      if (entities.length !== 1) throw new Error('Only expected on item');

      this.resize(entities[0].contentRect.width, entities[0].contentRect.height);
    });
    this._rezizeObserver.observe(this._parent);
  };

  dispose = () => {
    if (this._rezizeObserver) {
      this._rezizeObserver.disconnect();
    }
  };
}
