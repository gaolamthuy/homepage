/**
 * Test file cho FloatingZaloButton component
 * Kiểm tra functionality của floating Zalo button
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FloatingZaloButton from '@/components/ui/floating-zalo-button';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

describe('FloatingZaloButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
  });

  it('hiển thị button với số điện thoại mặc định', () => {
    render(<FloatingZaloButton />);
    
    // Kiểm tra button có tồn tại
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Kiểm tra số điện thoại mặc định
    expect(screen.getByText('0901.467.300')).toBeInTheDocument();
  });

  it('hiển thị button với số điện thoại tùy chỉnh', () => {
    render(<FloatingZaloButton phoneNumber="0123456789" />);
    
    // Kiểm tra số điện thoại tùy chỉnh
    expect(screen.getByText('0123456789')).toBeInTheDocument();
  });

  it('mở Zalo khi click button', () => {
    render(<FloatingZaloButton phoneNumber="0901.467.300" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Kiểm tra window.open được gọi với URL đúng
    expect(mockOpen).toHaveBeenCalledWith(
      'https://zalo.me/0901467300',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('hiển thị tooltip khi hover', () => {
    render(<FloatingZaloButton />);
    
    const button = screen.getByRole('button');
    
    // Hover vào button
    fireEvent.mouseEnter(button);
    
    // Kiểm tra tooltip hiển thị
    expect(screen.getByText('Chat Zalo ngay!')).toBeInTheDocument();
    
    // Unhover
    fireEvent.mouseLeave(button);
    
    // Kiểm tra tooltip ẩn
    expect(screen.queryByText('Chat Zalo ngay!')).not.toBeInTheDocument();
  });

  it('hiển thị ngay lập tức khi showOnScroll = false (mặc định)', () => {
    render(<FloatingZaloButton />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Button nên visible ngay lập tức (mặc định)
    expect(button.closest('div')).toHaveClass('opacity-100');
  });

  it('có accessibility attributes đúng', () => {
    render(<FloatingZaloButton phoneNumber="0901.467.300" />);
    
    const button = screen.getByRole('button');
    
    // Kiểm tra aria-label
    expect(button).toHaveAttribute('aria-label', 'Liên hệ Zalo 0901.467.300');
    
    // Kiểm tra title
    expect(button).toHaveAttribute('title', 'Chat Zalo với 0901.467.300');
  });

  it('có đúng CSS classes cho styling', () => {
    render(<FloatingZaloButton />);
    
    const button = screen.getByRole('button');
    const container = button.closest('div');
    
    // Kiểm tra container classes
    expect(container).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-50');
    
    // Kiểm tra button classes (đã bỏ background và border radius)
    expect(button).toHaveClass('group', 'p-2', 'transition-all');
    expect(button).not.toHaveClass('bg-[#2962ff]', 'rounded-full');
  });
});
