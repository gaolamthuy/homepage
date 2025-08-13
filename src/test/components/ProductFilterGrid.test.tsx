/**
 * Test file cho ProductFilterGrid component
 * Kiểm tra functionality của filter và grid sản phẩm
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductFilterGrid from '@/components/shop/ProductFilterGrid';
import type { Product, Category } from '@/types/shop';

// Mock data cho testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gạo Nở Thơm',
    description: 'Gạo nở thơm chất lượng cao',
    price: 25000,
    images: ['image1.jpg'],
    category: 'Gạo Nở',
    tags: ['thơm', 'ngon'],
    inStock: true,
    stockQuantity: 100,
    rating: 5,
    reviewCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    attributes: []
  },
  {
    id: '2',
    name: 'Gạo Dẻo',
    description: 'Gạo dẻo truyền thống',
    price: 22000,
    images: ['image2.jpg'],
    category: 'Gạo Dẻo',
    tags: ['dẻo', 'truyền thống'],
    inStock: true,
    stockQuantity: 80,
    rating: 4,
    reviewCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    attributes: []
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'Gạo Nở', description: 'Các loại gạo nở' },
  { id: '2', name: 'Gạo Dẻo', description: 'Các loại gạo dẻo' }
];

describe('ProductFilterGrid', () => {
  it('hiển thị tất cả sản phẩm khi không chọn category', () => {
    render(
      <ProductFilterGrid
        products={mockProducts}
        categories={mockCategories}
        allProductsFromAPI={[]}
      />
    );

    // Kiểm tra nút "Tất cả" được chọn mặc định
    const allButton = screen.getByText('Tất cả');
    expect(allButton).toHaveClass('border-primary');

    // Kiểm tra tất cả sản phẩm được hiển thị
    expect(screen.getByText('Gạo Nở Thơm')).toBeInTheDocument();
    expect(screen.getByText('Gạo Dẻo')).toBeInTheDocument();
  });

  it('lọc sản phẩm theo category khi click', () => {
    render(
      <ProductFilterGrid
        products={mockProducts}
        categories={mockCategories}
        allProductsFromAPI={[]}
      />
    );

    // Click vào category "Gạo Nở"
    const gaoNoButton = screen.getByText('Gạo Nở');
    fireEvent.click(gaoNoButton);

    // Kiểm tra chỉ hiển thị sản phẩm thuộc category "Gạo Nở"
    expect(screen.getByText('Gạo Nở Thơm')).toBeInTheDocument();
    expect(screen.queryByText('Gạo Dẻo')).not.toBeInTheDocument();
  });

  it('chuyển đổi category filter hoạt động đúng', () => {
    render(
      <ProductFilterGrid
        products={mockProducts}
        categories={mockCategories}
        allProductsFromAPI={[]}
      />
    );

    // Click vào "Gạo Dẻo"
    const gaoDeoButton = screen.getByText('Gạo Dẻo');
    fireEvent.click(gaoDeoButton);

    // Kiểm tra chỉ hiển thị sản phẩm "Gạo Dẻo"
    expect(screen.queryByText('Gạo Nở Thơm')).not.toBeInTheDocument();
    expect(screen.getByText('Gạo Dẻo')).toBeInTheDocument();

    // Click lại vào "Tất cả"
    const allButton = screen.getByText('Tất cả');
    fireEvent.click(allButton);

    // Kiểm tra hiển thị lại tất cả sản phẩm
    expect(screen.getByText('Gạo Nở Thơm')).toBeInTheDocument();
    expect(screen.getByText('Gạo Dẻo')).toBeInTheDocument();
  });

  it('hiển thị đúng số lượng sản phẩm khi có maxItems', () => {
    const manyProducts = Array.from({ length: 15 }, (_, i) => ({
      ...mockProducts[0],
      id: String(i + 1),
      name: `Sản phẩm ${i + 1}`
    }));

    render(
      <ProductFilterGrid
        products={manyProducts}
        categories={mockCategories}
        allProductsFromAPI={[]}
        maxItems={10}
      />
    );

    // Kiểm tra chỉ hiển thị 10 sản phẩm đầu tiên
    expect(screen.getByText('Sản phẩm 1')).toBeInTheDocument();
    expect(screen.getByText('Sản phẩm 10')).toBeInTheDocument();
    expect(screen.queryByText('Sản phẩm 11')).not.toBeInTheDocument();
  });
});
