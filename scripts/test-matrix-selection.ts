import { test, expect } from 'bun:test';
import { BLACK_FRIDAY_MODE,matrixUrlSelection,matrixTotal } from '../src/components/matrix/matrixConfig';
import { CASE_VARIANT_IDS } from '../src/components/matrix/matrixCommerce';
test('the eight Shopify case IDs remain unchanged',()=>expect(CASE_VARIANT_IDS).toEqual({
 '17pro':{cherry:'gid://shopify/ProductVariant/59116736545093',onyx:'gid://shopify/ProductVariant/59116736577861'},
 '17promax':{cherry:'gid://shopify/ProductVariant/59116736610629',onyx:'gid://shopify/ProductVariant/59116736643397'},
 '18pro':{cherry:'gid://shopify/ProductVariant/59116736676165',onyx:'gid://shopify/ProductVariant/59116736708933'},
 '18promax':{cherry:'gid://shopify/ProductVariant/59116736741701',onyx:'gid://shopify/ProductVariant/59116736774469'},
}));
test('no model is selected without URL parameters',()=>expect(matrixUrlSelection('').model).toBeNull());
test('unknown variant cannot preselect a model',()=>expect(matrixUrlSelection('?variant=123').model).toBeNull());
for(const [model,finishes] of Object.entries(CASE_VARIANT_IDS)) for(const [color,id] of Object.entries(finishes)) test(`Shopping variant selects ${model} ${color}`,()=>{expect(matrixUrlSelection('?variant='+id.split('/').pop())).toEqual({model,color});expect(matrixUrlSelection('?variant='+encodeURIComponent(id))).toEqual({model,color});});
test('model and color parameters remain supported',()=>expect(matrixUrlSelection('?model=iPhone%2017%20Pro%20Max&color=Onyx%20Carbon')).toEqual({model:'17promax',color:'onyx'}));
test('variant takes precedence over model/color',()=>expect(matrixUrlSelection('?variant=59116736545093&model=18pro&color=onyx')).toEqual({model:'17pro',color:'cherry'}));
test('single case total is CHF 59',()=>expect(matrixTotal(false,false)).toBe(59));
test('AirPods bundle total is CHF 79',()=>expect(matrixTotal(true,false)).toBe(79));
test('two case total is CHF 99',()=>expect(matrixTotal(false,true)).toBe(99));
test('Black Friday presentation defaults off',()=>expect(BLACK_FRIDAY_MODE).toBe(false));
test('two case original price is CHF 118',async()=>{const { MATRIX_PRICES }=await import('../src/components/matrix/matrixConfig');expect(MATRIX_PRICES.twoOriginal).toBe(118);});
test('AirPods bundle original price is CHF 94',async()=>{const { MATRIX_PRICES }=await import('../src/components/matrix/matrixConfig');expect(MATRIX_PRICES.airpodsOriginal).toBe(94);});
