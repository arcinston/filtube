declare module 'ethereum-blockies' {
  interface BlockieOptions {
    seed: string;
    size?: number;
    scale?: number;
    color?: string;
    bgcolor?: string;
    spotcolor?: string;
  }

  export function create(options: BlockieOptions): HTMLCanvasElement;
}
