declare module 'swagger-ui-react' {
  import { ComponentType } from 'react';

  interface SwaggerUIProps {
    spec?: object;
    url?: string;
    layout?: string;
    docExpansion?: 'list' | 'full' | 'none';
    defaultModelExpandDepth?: number;
    defaultModelsExpandDepth?: number;
    filter?: boolean | string;
    maxDisplayedTags?: number;
    operationsSorter?: (a: any, b: any) => number;
    showMutatedRequest?: boolean;
    supportedSubmitMethods?: string[];
    tryItOutEnabled?: boolean;
    requestInterceptor?: (req: any) => any;
    responseInterceptor?: (res: any) => any;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    displayOperationId?: boolean;
    deepLinking?: boolean;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}