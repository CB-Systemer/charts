import p5 from 'p5';
import { Circle } from './circle';
import { Line } from './line';
import { Swimlane } from './swimlane';
import { XAxis } from './x-axis';
import { XCalc, YCalc } from './xcalc';
import Logger, { ILogger } from 'js-logger';

export interface GraphOptions {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  spaceGraphSwimlanes: number;
  swimlaneHeight: number;
  xAxisFormatter: (data: string) => string;
  textSize: number;
  labelTextSize: number;
  fonts: string[];
  logger: ILogger | undefined;
}

export interface XAxisData {
  id: string;
  data: string;
}
export interface GraphData {
  id: string;
  value: number;
}

export interface GraphSwimlaneData {
  label: string;
  squares: {
    id: string;
    value: string;
    fillColor: string;
    strokeColor: string;
    gradientBottomColor: string;
    gradientTopColor: string;
  }[];
  blocks: {
    id1: string;
    id2: string;
    label: string;
    fillColor: string;
    strokeColor: string;
    gradientBottomColor: string;
    gradientTopColor: string;
  }[];
}

export class Graph {
  private _parent: HTMLElement;
  private _p: p5;
  private _rezizeObserver: ResizeObserver;
  private _options: GraphOptions;

  private logger: ILogger;
  private font: string;
  private xaxis: XAxisData[];
  private graphData: GraphData[][];
  private swimlaneData: GraphSwimlaneData[];

  private xcalc: XCalc;
  private ycalc: YCalc;

  constructor(parent: HTMLElement, options: GraphOptions, xaxis: XAxisData[], graphData: GraphData[][], swimlaneData: GraphSwimlaneData[]) {
    this._parent = parent;
    this._options = {
      ...{
        marginTop: 20,
        marginRight: 10,
        marginBottom: 20,
        marginLeft: 10,
        spaceGraphSwimlanes: 30,
        swimlaneHeight: 20,
        xAxisFormatter: graphData => graphData,
        textSize: 16,
        labelTextSize: 12,
        fonts: [],
        logger: Logger,
      },
      ...options,
    };
    this.logger = this._options.logger ?? Logger.get('Graph');
    this.logger.debug('Graph setup with options', this._options);

    this.xaxis = xaxis;

    this.graphData = graphData;
    this.swimlaneData = swimlaneData;

    if (!this.xaxis) {
      throw new Error('xaxis has not been provided');
    }

    this.setup();
    this.calcAndFill();

    this._p.draw = this.draw;
  }

  setup = () => {
    this.logger.debug('Setup begin');

    this._p = new p5(() => {
      // We setup
    }, this._parent);

    for (let index = 0; index < this._options.fonts.length; index++) {
      const element = this._options.fonts[index];

      try {
        const result = document.fonts.check(`${this._options.textSize}px ${element}`);
        if (result) {
          this.logger.debug(`Font: '${element}' found on local system`);
          this.font = element;
          break;
        }
      } catch {
        // ignore and continue to the next font
        this.logger.debug(`Font: ${element} not found found on local system.`);
      }
    }

    this._p.createCanvas(this._parent.getBoundingClientRect().width, this._parent.getBoundingClientRect().height);

    this.setupResize();

    this.logger.debug('Setup end');
  };

  calcAndFill = () => {
    this.calc();
    this.fillCircles();
    this.fillGraphYLines();
    this.fillSwimlanes();
    this.fillXAxis();
  };

  calc = () => {
    this.calcX();
    this.calcY();
  };

  calcX = () => {
    this._p.textSize(this._options.textSize);
    const maxSwimlaneLabelWidth = this.swimlaneData.map(x => this._p.textWidth(x.label)).reduce((a, b) => Math.max(a, b), 0);
    const graphMarginL = maxSwimlaneLabelWidth + this._options.marginLeft;

    const widthBetween = (this._parent.getBoundingClientRect().width - (graphMarginL + this._options.marginRight)) / this.xaxis.length;
    const split = Math.round(this.xaxis.length / 3);
    this.xcalc = {
      graphMarginL,
      positions: [...new Array(this.xaxis.length).keys()].map(x => ({
        x: graphMarginL + x * widthBetween,
        hasMark: x % split === 0 || x === this.xaxis.length - 1,
        label: this._options.xAxisFormatter(this.xaxis[x].data),
      })),
    };
  };

  calcY = () => {
    const marginBWithSwimlanes = this._options.spaceGraphSwimlanes + this.swimlaneData.length * this._options.swimlaneHeight + this._options.marginBottom;

    const availableHeightForGraph = this._p.height - this._options.marginTop - marginBWithSwimlanes;
    const maxValue = this.graphData.map(x => x.reduce((p, c) => Math.max(p, c.value), 0)).reduce((p, c) => Math.max(p, c), 0);
    const minValue = 0;
    const middleValue = (maxValue - minValue) / 2;

    const graphMaxValue = Math.round(maxValue * 1);
    const bottomLine = this._options.marginTop + availableHeightForGraph;
    const topLine = this._options.marginTop;
    const middleLine = Math.round((bottomLine - topLine) / 2) + this._options.marginTop;

    const lineLabels = [maxValue.toString(), middleValue.toString(), minValue.toString()];
    const maxLineLabelsWidth = lineLabels.map(x => this._p.textWidth(x)).reduce((p, c) => Math.max(p, c), 0);

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

  graphCircles: Circle[][];
  graphLines: Line[];
  swimlanes: Swimlane[];
  xAxis: XAxis;

  fillCircles = () => {
    this.graphCircles = this.graphData.map(x =>
      x.map(
        y =>
          new Circle(this._p, {
            x: this.getX(y.id),
            y: this._p.height - y.value * this.ycalc.height - this.ycalc.marginBWithSwimlanes,
            d: 3,
            mouseD: 20,
            label: y.value.toString(),
          }),
      ),
    );
  };

  fillGraphYLines = () => {
    this.graphLines = [];
    this.graphCircles.forEach(x => {
      x.forEach((_, ii) => {
        if (ii === 0) return;

        this.graphLines.push(
          new Line(this._p, {
            x1: x[ii - 1].data.x,
            y1: x[ii - 1].data.y,
            x2: x[ii].data.x,
            y2: x[ii].data.y,
          }),
        );
      });
    });
  };

  fillSwimlanes = () => {
    this.swimlanes = this.swimlaneData.map(
      (x, i) =>
        new Swimlane(this._p, {
          label: x.label,
          x: this.xcalc.graphMarginL,
          y: this.ycalc.swimLanes[i],
          height: this._options.swimlaneHeight,
          d: 16,
          marginX: this.xcalc.graphMarginL,
          squares: x.squares?.map(c => ({
            x: this.getX(c.id),
            value: c.value,
            stroke: this._p.color(c.strokeColor ?? '#065f46'),
            fill: this._p.color(c.fillColor ?? '#065f46'),
            cornerRadius: 5,
            gradientBottom: this._p.color(c.gradientBottomColor ?? '#bbf7d0'),
            gradientTop: this._p.color(c.gradientTopColor ?? '#f0fdf4'),
          })),
          blocks: x.blocks?.map(b => ({
            x1: this.getX(b.id1),
            x2: this.getX(b.id2),
            label: b.label,
            stroke: this._p.color(b.strokeColor ?? '#075985'),
            fill: this._p.color(b.fillColor ?? '#075985'),
            cornerRadius: 5,
            gradientBottom: this._p.color(b.gradientBottomColor ?? '#7dd3fc'),
            gradientTop: this._p.color(b.gradientTopColor ?? '#f0f9ff'),
          })),
        }),
    );
  };

  getX = (id: string) => {
    const xAxis = this.xaxis.findIndex(y => y.id === id);
    return this.xcalc.positions[xAxis]?.x;
  };

  fillXAxis = () => {
    this.xAxis = new XAxis(this._p, {
      marginX: this.xcalc.graphMarginL,
      marginB: this.ycalc.marginBWithSwimlanes,
      xcalc: this.xcalc,
      textSize: this._options.labelTextSize,
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

    this.logger.debug('Drawing:');

    this.mouseX = this._p.mouseX;
    this.mouseY = this._p.mouseY;

    this._p.background(this._p.color(255));

    this._p.textFont(this.font);
    this._p.textSize(this._options.textSize);
    this._p.textAlign(this._p.LEFT, this._p.TOP);

    var mx = this.mouseX;
    var my = this.mouseY;

    this.logger.debug('Drawing swimlanes');
    this.swimlanes.reverse().forEach(x => x.draw(mx, my));

    this.logger.debug('Drawing xAxis');
    this.xAxis.draw();

    this.logger.debug('Drawing overlayAboveGraph');
    this.drawOverlayAboveGraph();

    this.logger.debug('Drawing graphLines');
    this.drawGraphLines();

    this.ycalc.swimLanes.forEach((y, i) => {
      this._p.stroke(200);
      this._p.strokeWeight(1);
      this._p.line(0, y, this._p.width, y);
      this._p.strokeWeight(0);
      this._p.fill(0);
      this._p.textSize(this._options.textSize);
      this._p.text(this.swimlaneData[i].label, 10, y + this._options.swimlaneHeight / 2);

      if (i === this.ycalc.swimLanes.length - 1) {
        this._p.stroke(200);
        this._p.strokeWeight(1);
        this._p.line(0, y + this._options.swimlaneHeight, this._p.width, y + this._options.swimlaneHeight);
      }
    });

    this.logger.debug('Drawing graphLines');
    this.graphLines.forEach(x => x.draw(mx, my));
    this.logger.debug('Drawing graphCircles');
    this.graphCircles.forEach(x =>
      x.forEach(y => {
        y.draw(mx, my);
      }),
    );
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
      for (let ii = 0; ii < element.length; ii++) {
        const e = element[ii];

        if (e.isMouseOver(this._p.mouseX, this._p.mouseY)) {
          console.log('Redraw: Cursor is hovering a circle');
          onDrawElement = true;
          break;
        }
      }
      if (onDrawElement) {
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
    if (this.graphCircles.length === 0) {
      return;
    }

    const list: { x: number; y: number }[] = [];
    this.graphCircles.forEach(x => {
      x.forEach(y => {
        let f = list.find(l => l.x === y.data.x);
        if (!f) {
          f = {
            x: y.data.x,
            y: y.data.y,
          };
          list.push(f);
        } else {
          f.y = Math.max(y.data.y, f.y);
        }
      });
    });

    this._p.fill(255);
    this._p.stroke(255);
    this._p.strokeWeight(0);
    this._p.beginShape();
    this._p.vertex(0, 0);
    this._p.vertex(0, list.at(0).y, 0);

    list.forEach(x => {
      this._p.vertex(x.x, x.y);
    });
    this._p.vertex(this._p.width, list.at(-1).y);
    this._p.vertex(this._p.width, 0);
    this._p.endShape(this._p.CLOSE);
  };

  drawGraphLines = () => {
    this._p.strokeWeight(1);
    this._p.textAlign(this._p.LEFT, this._p.CENTER);
    this.ycalc.graphLines.forEach((y, i) => {
      this._p.stroke(200);
      this._p.strokeWeight(1);
      this._p.line(this.ycalc.maxLineLabelsWidth + 20, y, this._p.width, y);
      this._p.strokeWeight(0);
      this._p.fill(0, 0, 0);
      this._p.textSize(this._options.textSize);
      this._p.text(this.ycalc.lineLabels[i], 10, y);
    });
  };

  resize = (width: number, height: number) => {
    this.logger.debug('Resizing');
    this.calc();
    this.fillCircles();
    this.fillGraphYLines();
    this.fillSwimlanes();
    this.fillXAxis();

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
    this._parent.childNodes.forEach(x => x.remove());
    if (this._rezizeObserver) {
      this._rezizeObserver.disconnect();
    }
  };
}
