import { Config } from '@stencil/core';

export const config: Config = {
  devServer: {
    reloadStrategy: 'pageReload',
  },
  sourceMap: true,
  namespace: 'realequity-charts',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
  ],
};
