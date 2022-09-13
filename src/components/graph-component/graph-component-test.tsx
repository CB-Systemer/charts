import { Component, h, Prop } from '@stencil/core';
import Logger, { ILogger } from 'js-logger';
import { GraphData, GraphOptions, GraphSwimlaneData, XAxisData } from './draw/graph';

@Component({
  tag: 'graph-component-test',
  shadow: false,
})
export class GraphComponent {
  @Prop() options: GraphOptions;
  @Prop() data: {
    xaxis: XAxisData[];
    graphData: GraphData[][];
    swimlaneData: GraphSwimlaneData[];
  };

  logger: ILogger;
  componentDidLoad() {
    Logger.useDefaults({
      defaultLevel: Logger.DEBUG,
    });

    this.logger = Logger.get('Graph');
    this.logger.setLevel(this.logger.DEBUG);
  }

  render() {
    return (
      <graph-component
        options={{ ...this.options, logger: this.logger }}
        data={this.data}
        ref={r => {
          (r as any).style = 'height: 200px; display: flex; flex-direction: column; flex: 1; overflow: hidden;';
        }}
      />
    );
  }
}
