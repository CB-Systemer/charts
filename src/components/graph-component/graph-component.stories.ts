import { getComponentWithArgs } from '../../utils/storybook-utils';
import { GraphData } from './draw/graph';

const randomData = (): GraphData[] => {
  const graphData = [];
  for (let index = 6; index < 45; index++) {
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
      data: [
        {
          x: 9,
          value: 'Kampagne 1',
        },
        {
          x: 24,
          value: 'Kampagne 1',
        },
      ],
    },
    {
      label: 'Lane 2',
      data: [
        {
          x: 13,
          value: 'Kampagne 2',
        },
        {
          x: 25,
          value: 'Kampagne 2',
        },
      ],
    },
  ],
  options: {
    marginTop: 20,
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    spaceGraphSwimlanes: 30,
    swimlaneHeight: 20,
    xAxisFormatter: graphData => graphData.date.toLocaleDateString(),
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
