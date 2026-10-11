/** In-memory handoff from the pre-bundle MATRIX view; never uses browser storage. */
export interface MatrixShellIntent {
  modelId: string;
  buy: boolean;
  headerAction?: "cart" | "menu";
}

declare global {
  interface Window {
    __matrixShellIntent?: MatrixShellIntent;
  }
}

export function readMatrixShellIntent(): MatrixShellIntent | undefined {
  return typeof window === "undefined" ? undefined : window.__matrixShellIntent;
}