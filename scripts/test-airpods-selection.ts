import {test,expect} from 'bun:test';
import {AIRPODS_PRICE,airpodsNeedsModel,FINISHES,type ModelId} from '../src/components/airpods/airpodsContent';
test('single AirPods case CHF 35',()=>expect(AIRPODS_PRICE).toBe(35));
test('sets without model must not checkout',()=>expect(airpodsNeedsModel(true,null)).toBe(true));
test('single case does not need model',()=>expect(airpodsNeedsModel(false,null)).toBe(false));
for(const model of ['17pro','17promax','18pro','18promax'] as ModelId[])test(`set accepts ${model}`,()=>expect(airpodsNeedsModel(true,model)).toBe(false));
test('both finishes keep distinct Shopify variants',()=>{expect(FINISHES.length).toBe(2);expect(FINISHES[0].variantId).not.toBe(FINISHES[1].variantId);});