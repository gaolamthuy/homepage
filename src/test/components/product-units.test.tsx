/**
 * Test file cho Product Units functionality
 * Kiểm tra hiển thị units và pricing trong ProductDetail
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductDetail from '@/components/shop/ProductDetail';
import type { Product, ProductUnit } from '@/types/shop';

// Mock data với units
const mockProductWithUnits: Product = {
  id: '3065552',
  name: '504',
  fullName: '504 - Tiêu chuẩn (kg)',
  description: 'Gạo tròn hè 2024',
  price: 16500,
  images: ['https://example.com/image1.jpg'],
  category: 'Gạo nở',
  tags: ['thơm', 'ngon'],
  inStock: true,
  stockQuantity: 1000,
  rating: 5,
  reviewCount: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  attributes: [
    { productId: 3065552, attributeName: 'MỨC ĐỘ MỚI', attributeValue: 'Tiêu chuẩn' }
  ],
  code: '2021101',
  categoryId: 132086,
  allowsSale: true,
  hasVariants: true,
  unit: 'kg',
  isActive: true,
  masterProductId: null,
  units: [
    {
      id: 30962967,
      code: 'SP000051',
      name: '504',
      fullName: '504 - Tiêu chuẩn (bao 50kg)',
      unit: 'bao 50kg',
      conversionValue: 50,
      basePrice: 815000,
      allowssale: false,
      masterUnitId: 3065552
    },
    {
      id: 30962968,
      code: 'SP000052',
      name: '504',
      fullName: '504 - Tiêu chuẩn (túi 5kg)',
      unit: 'túi 5kg',
      conversionValue: 5,
      basePrice: 85000,
      allowssale: true,
      masterUnitId: 3065552
    }
  ],
  glt: {
    glt_kiotvietshop_url: 'https://gaolamthuy.vn/c/gao-no/p/504-320896',
    glt_shopee_url: 'https://shopee.vn/gaolamthuy/product/504'
  }
};

const mockProductWithoutUnits: Product = {
  id: '3065553',
  name: '504',
  fullName: '504 - Lở (kg)',
  description: 'Gạo Ấn Swarna mộc cũ',
  price: 15500,
  images: ['https://example.com/image2.jpg'],
  category: 'Gạo nở',
  tags: ['dẻo'],
  inStock: true,
  stockQuantity: 800,
  rating: 4,
  reviewCount: 8,
  createdAt: new Date(),
  updatedAt: new Date(),
  attributes: [],
  code: '2022101',
  categoryId: 132086,
  allowsSale: true,
  hasVariants: true,
  unit: 'kg',
  isActive: true,
  masterProductId: 3065552,
  units: [], // Không có units
  glt: {
    glt_shopee_url: null
  }
};

describe('ProductDetail Units Display', () => {
  it('hiển thị units pricing khi sản phẩm có units', () => {
    render(<ProductDetail product={mockProductWithUnits} />);
    
    // Kiểm tra hiển thị giá chính với /unit
    expect(screen.getByText('/kg')).toBeInTheDocument();
    
    // Kiểm tra hiển thị các units dạng text đơn giản
    expect(screen.getByText('815.000 ₫ / bao 50kg')).toBeInTheDocument();
    expect(screen.getByText('85.000 ₫ / túi 5kg')).toBeInTheDocument();
    
    // Kiểm tra hiển thị "Không bán lẻ" cho unit có allowssale = false
    expect(screen.getByText('(Không bán lẻ)')).toBeInTheDocument();
  });

  it('không hiển thị units pricing khi sản phẩm không có units', () => {
    render(<ProductDetail product={mockProductWithoutUnits} />);
    
    // Vẫn hiển thị giá chính với /unit
    expect(screen.getByText('155.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('/kg')).toBeInTheDocument();
    
    // Không hiển thị units
    expect(screen.queryByText('815.000 ₫ / bao 50kg')).not.toBeInTheDocument();
  });

  it('hiển thị đúng format giá cho units', () => {
    render(<ProductDetail product={mockProductWithUnits} />);
    
    // Kiểm tra format giá đúng với /unit
    expect(screen.getByText('815.000 ₫ / bao 50kg')).toBeInTheDocument();
    expect(screen.getByText('85.000 ₫ / túi 5kg')).toBeInTheDocument();
  });

  it('hiển thị thông tin unit đầy đủ', () => {
    render(<ProductDetail product={mockProductWithUnits} />);
    
    // Kiểm tra format đầy đủ: price / unit
    expect(screen.getByText('815.000 ₫ / bao 50kg')).toBeInTheDocument();
    expect(screen.getByText('85.000 ₫ / túi 5kg')).toBeInTheDocument();
  });
});
