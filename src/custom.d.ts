declare module '*.svg' {
  const content: any;
  export default content;
}

declare interface NodeModule {
  hot: {
    accept(path?: string, callback?: () => void): void;
  };
}