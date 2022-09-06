import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { Graph, GraphData, GraphOptions, GraphSwimlaneData } from './draw/graph';

@Component({
  tag: 'graph-component',
  shadow: false,
})
export class GraphComponent {
  graph: Graph;

  @Prop() graphData: GraphData[] = [];
  @Prop() swimlaneData: GraphSwimlaneData[];
  @Prop() options: GraphOptions;

  componentDidLoad() {
    this.graph = new Graph(this.graphContainerRef, this.options, this.graphData, this.swimlaneData);
  }

  @Watch('graphData')
  graphDataWatch() {
    this.graph.dispose();
    this.graph = new Graph(this.graphContainerRef, this.options, this.graphData, this.swimlaneData);
  }

  setGraphContainerRef = (r: HTMLElement) => {
    if (this.graphContainerRef) {
      return;
    }

    this.graphContainerRef = r;
  };
  @State() graphContainerRef: HTMLElement;

  disconnectedCallback() {
    if (this.graph) {
      this.graph.dispose();
    }
  }

  render() {
    return (
      <Host style={{ display: 'flex', flex: '1', minWidth: '0', minHeight: '0' }}>
        <div id="container" ref={ref => this.setGraphContainerRef(ref)} style={{ overflow: 'hidden', width: '100%', height: '100%', display: 'flex' }}></div>
      </Host>
    );
  }
}
