export default interface Tip {
  title: string;
  type: string;
  coords: {
    x: number | null;
    y: number | null;
  };
  progress?: any;
  overlayTarget?: any;
  zIndexRefElement?: any;
  anchor?: any;
  currentRef: any;
}