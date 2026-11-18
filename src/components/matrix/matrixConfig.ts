import { CASE_VARIANT_IDS } from './matrixCommerce';
export const BLACK_FRIDAY_MODE = false;
export type MatrixModelId = '17pro' | '17promax' | '18pro' | '18promax';
export function matrixUrlSelection(search: string) {
  const params = new URLSearchParams(search);
  const variant = params.get('variant')?.split('/').pop();
  for (const [model, finishes] of Object.entries(CASE_VARIANT_IDS)) {
    for (const [color, id] of Object.entries(finishes)) {
      if (variant && id.split('/').pop() === variant) return { model: model as MatrixModelId, color };
    }
  }
  const raw = params.get('model')?.toLowerCase().replace(/iphone|[\s_-]/g, '');
  const model = raw && Object.prototype.hasOwnProperty.call(CASE_VARIANT_IDS, raw) ? raw as MatrixModelId : null;
  const rawColor = params.get('color')?.toLowerCase().replace(/[\s_-]|carbon/g, '');
  return { model, color: rawColor === 'onyx' ? 'onyx' : 'cherry' };
}
