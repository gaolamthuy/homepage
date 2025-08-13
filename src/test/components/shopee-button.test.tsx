/**
 * Test file cho Shopee Button functionality
 * Kiểm tra hiển thị và hoạt động của Shopee button
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductDetail from '@/components/shop/ProductDetail';
import type { Product } from '@/types/shop';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});

// Mock data với Shopee URL
const mockProductWithShopee: Product = {
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
  attributes: [],
  code: '2021101',
  categoryId: 132086,
  allowsSale: true,
  hasVariants: true,
  unit: 'kg',
  isActive: true,
  masterProductId: null,
  units: [],
  glt: {
    glt_kiotvietshop_url: 'https://gaolamthuy.vn/c/gao-no/p/504-320896',
    glt_shopee_url: 'https://shopee.vn/gaolamthuy/product/504'
  }
};

// Mock data không có Shopee URL
const mockProductWithoutShopee: Product = {
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
  units: [],
  glt: {
    glt_shopee_url: null
  }
};

describe('Shopee Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hiển thị "Đặt hàng Shopee" khi có Shopee URL', () => {
    render(<ProductDetail product={mockProductWithShopee} />);
    
    // Kiểm tra button hiển thị
    expect(screen.getByText('Đặt hàng Shopee')).toBeInTheDocument();
    
    // Kiểm tra button không bị disabled
    const shopeeButton = screen.getByText('Đặt hàng Shopee').closest('button');
    expect(shopeeButton).not.toBeDisabled();
  });

  it('hiển thị "Đang phát triển" khi không có Shopee URL', () => {
    render(<ProductDetail product={mockProductWithoutShopee} />);
    
    // Kiểm tra button hiển thị "Đang phát triển"
    expect(screen.getByText('Đang phát triển')).toBeInTheDocument();
    
    // Kiểm tra button bị disabled
    const shopeeButton = screen.getByText('Đang phát triển').closest('button');
    expect(shopeeButton).toBeDisabled();
  });

  it('mở Shopee URL khi click button', () => {
    render(<ProductDetail product={mockProductWithShopee} />);
    
    const shopeeButton = screen.getByText('Đặt hàng Shopee');
    fireEvent.click(shopeeButton);
    
    // Kiểm tra window.open được gọi với URL đúng
    expect(mockOpen).toHaveBeenCalledWith(
      'https://shopee.vn/gaolamthuy/product/504',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('không mở URL khi Shopee URL là null', () => {
    render(<ProductDetail product={mockProductWithoutShopee} />);
    
    const shopeeButton = screen.getByText('Đang phát triển');
    fireEvent.click(shopeeButton);
    
    // Kiểm tra window.open không được gọi
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('có Shopee icon với màu đúng', () => {
    render(<ProductDetail product={mockProductWithShopee} />);
    
    // Kiểm tra Shopee icon có màu #f4511e
    const shopeeIcon = screen.getByText('Đặt hàng Shopee').querySelector('svg');
    expect(shopeeIcon).toHaveClass('text-[#f4511e]');
  });

  it('có đúng variant và styling', () => {
    render(<ProductDetail product={mockProductWithShopee} />);
    
    const shopeeButton = screen.getByText('Đặt hàng Shopee').closest('button');
    
    // Kiểm tra variant outline
    expect(shopeeButton).toHaveClass('border');
    
    // Kiểm tra responsive layout
    expect(shopeeButton).toHaveClass('flex-1');
  });
});
