import { test, expect } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { useProductReviews } from '../src/hooks/useProductReviews';

test('homepage total sums approved reviews from all three products', () => {
  const client = new QueryClient();
  client.setQueryData(['approved-product-reviews'], [
    { id: 'n1', product_id: 'nexus', rating: 5 },
    { id: 'm1', product_id: 'matrix', rating: 5 },
    { id: 'm2', product_id: 'matrix', rating: 4 },
    { id: 'a1', product_id: 'airpods-case', rating: 5 },
    { id: 'g1', product_id: 'matrix', rating: 1, source: 'google' },
  ]);
  let total = -1;
  let average = -1;
  function Probe() {
    const { stats } = useProductReviews();
    total = stats.total;
    average = stats.average;
    return null;
  }
  renderToStaticMarkup(<QueryClientProvider client={client}><Probe /></QueryClientProvider>);
  expect(total).toBe(4);
  expect(average).toBe(4.75);
  client.clear();
});

test('homepage MATRIX rating uses only approved MATRIX reviews', () => {
  const client = new QueryClient();
  client.setQueryData(['approved-product-reviews'], [
    { id: 'n1', product_id: 'nexus', rating: 1 },
    { id: 'm1', product_id: 'matrix', rating: 5 },
    { id: 'm2', product_id: 'matrix', rating: 4 },
    { id: 'a1', product_id: 'airpods-case', rating: 2 },
    { id: 'g1', product_id: 'matrix', rating: 1, source: 'google' },
  ]);
  let total = -1;
  let average = -1;
  function Probe() {
    const { stats } = useProductReviews('matrix');
    total = stats.total;
    average = stats.average;
    return null;
  }
  renderToStaticMarkup(<QueryClientProvider client={client}><Probe /></QueryClientProvider>);
  expect(total).toBe(2);
  expect(average).toBe(4.5);
  client.clear();
});