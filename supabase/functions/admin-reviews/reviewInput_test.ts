import { manualReviewSchema, reviewSettingsSchema } from './reviewInput.ts';
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
Deno.test('settings accept only raj or google source', () => {
  assertEquals(reviewSettingsSchema.safeParse({id:'00000000-0000-4000-8000-000000000000',source:'other',featured_home:false}).success,false);
});
Deno.test('manual reviews strip caller verified and approval flags', () => {
  const parsed=manualReviewSchema.parse({customer_name:'Fixture',rating:5,title:'Fixture',comment:'Fixture only',created_at:'2026-11-01T12:00:00Z',product_id:'matrix',source:'google',verified_purchase:true,status:'approved'});
  assertEquals('verified_purchase' in parsed,false);
  assertEquals('status' in parsed,false);
});