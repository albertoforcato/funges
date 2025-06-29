declare module '@welldone-software/why-did-you-render' {
  import { ComponentType } from 'react';

  interface WhyDidYouRenderOptions {
    trackAllPureComponents?: boolean;
    trackHooks?: boolean;
    logOwnerReasons?: boolean;
    collapseGroups?: boolean;
    hotReloadBufferMs?: number;
  }

  interface WhyDidYouRenderComponentOptions {
    whyDidYouRender?: boolean | WhyDidYouRenderOptions;
  }

  function whyDidYouRender(React: any, options?: WhyDidYouRenderOptions): void;

  export = whyDidYouRender;
}

declare global {
  namespace React {
    interface Component<P = {}, S = {}, SS = any> {
      whyDidYouRender?: boolean | any;
    }
  }
}
