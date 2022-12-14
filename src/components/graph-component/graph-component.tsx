import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { Graph, GraphData, GraphOptions, GraphSwimlaneData, XAxisData } from './draw/graph';

@Component({
  tag: 'graph-component',
  shadow: false,
})
export class GraphComponent {
  graph: Graph;

  @Prop() options: GraphOptions;
  @Prop() data: {
    xaxis: XAxisData[];
    graphData: GraphData[][];
    swimlaneData: GraphSwimlaneData[];
  };

  componentDidLoad() {
    this.loadGraph();
  }

  @Watch('data')
  graphDataWatch() {
    this.graph.dispose();
    this.loadGraph();
  }

  loadGraph() {
    this.graph = new Graph(this.graphContainerRef, this.options, this.data.xaxis, this.data.graphData, this.data.swimlaneData);
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
