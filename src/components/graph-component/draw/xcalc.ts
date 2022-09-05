export interface XCalc {
  graphMarginL: number;
  positions: {
    x: number;
    hasMark: boolean;
    label: string;
  }[];
}

export interface YCalc {
  height: number;
  marginBWithSwimlanes: number;
  maxLineLabelsWidth: number;
  lineLabels: string[];
  graphLines: number[];
  swimLanes: number[];
}
