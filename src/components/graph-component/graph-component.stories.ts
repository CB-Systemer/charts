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
  graphData: randomData(),
  swimlaneData: [
    {
      label: 'Lane 1',
      circles: [
        {
          id: '9',
          value: 'Kampagne 1',
        },
        {
          id: '24',
          value: 'Kampagne 1',
        },
      ],
      blocks: [],
    },
    {
      label: 'Lane 2',
      circles: [
        {
          id: '13',
          value: 'Kampagne 2',
        },
        {
          id: '25',
          value: 'Kampagne 2',
        },
      ],
      blocks: [
        {
          id1: '12',
          id2: '19',
          label: 'Some block',
        },
      ],
    },
  ],
  options: {
    xAxis: xAxis(),
    marginTop: 20,
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    spaceGraphSwimlanes: 30,
    swimlaneHeight: 20,
    xAxisFormatter: graphData => new Date(graphData).toLocaleDateString(),
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