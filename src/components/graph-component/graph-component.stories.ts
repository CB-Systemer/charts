import { getComponentWithArgs } from '../../utils/storybook-utils';
import { GraphData } from './draw/graph';

const xAxis = (): {
  id: string;
  data: string;
}[] => {
  const graphData = [];
  for (let index = 3; index < 50; index++) {
    graphData.push({
      id: index.toString(),
      data: new Date(Date.UTC(2022, 8, index)).toISOString(),
    });
  }

  return graphData;
};

const randomData = (): GraphData[] => {
  const graphData = [];
  for (let index = 6; index < 45; index++) {
    if (index > 10 && index < 16) continue;
    graphData.push({
      id: index.toString(),
      date: new Date(Date.UTC(2022, 8, index)),
      value: Math.round(Math.random() * 40),
    });
  }

  return graphData;
};

const defaultArgs = {
  data: {
    xaxis: xAxis(),
    graphData: [randomData(), randomData()],
    swimlaneData: [
      {
        label: 'Lane 1',
        squares: [
          {
            id: '9',
            value: '6',
            fillColor: '#065f46',
            strokeColor: '#065f46',
            gradientBottomColor: '#bbf7d0',
            gradientTopColor: '#f0fdf4',
          },
          {
            id: '24',
            value: '2',
            fillColor: '#5f0621',
            strokeColor: '#5f0621',
            gradientBottomColor: '#f7bbcc',
            gradientTopColor: '#fdf0f3',
          },
        ],
        blocks: [],
      },
      {
        label: 'Lane 2',
        squares: [
          {
            id: '26',
            value: '',
            fillColor: '#075985',
            strokeColor: '#075985',
            gradientBottomColor: '#7dd3fc',
            gradientTopColor: '#f0f9ff',
          },
        ],
        blocks: [
          {
            id1: '12',
            id2: '19',
            label: '',
            fillColor: '#075985',
            strokeColor: '#075985',
            gradientBottomColor: '#7dd3fc',
            gradientTopColor: '#f0f9ff',
          },
        ],
      },
    ],
  },
  options: {
    marginTop: 20,
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    spaceGraphSwimlanes: 30,
    swimlaneHeight: 25,
    xAxisFormatter: graphData => new Date(graphData).toLocaleDateString(),
    textSize: 16,
    labelTextSize: 12,
  },
};

export default {
  title: 'Library/Graph',
  argTypes: {},
  args: {
    ...defaultArgs,
  },
};

const MyComponent = args => {
  return getComponentWithArgs('graph-component', args, undefined, 'margin: 30px; height: 200px; display: flex; flex-direction: column; flex: 1; overflow: hidden; height: 200px');
};

export const Default = MyComponent.bind({});
Default.args = {};
