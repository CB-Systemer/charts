export const getComponentWithArgs = (componentName: string, args: any, limitHeight?: number, styles?: string) => {
  const component: any = document.createElement(componentName);
  Object.entries(args).forEach(arg => {
    if (typeof arg[1] === 'function') component.addEventListener(arg[0], arg[1]);
    else component[arg[0]] = arg[1];
  });

  const wrap: any = document.createElement('div');
  if (limitHeight) {
    wrap.style = 'height: ' + limitHeight + 'px';
  }
  if (styles) {
    wrap.style = styles;
  }
  wrap.classList.add('overflow-auto');

  wrap.appendChild(component);
  return wrap;
};

export const getComponentWithArgsWithoutTheme = (componentName: string, args: any) => {
  const component: any = document.createElement(componentName);
  Object.entries(args).forEach(arg => {
    if (typeof arg[1] === 'function') component.addEventListener(arg[0], arg[1]);
    else component[arg[0]] = arg[1];
  });

  return component;
};
