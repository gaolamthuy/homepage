/**
 * Performance Monitoring Utility
 * Theo dõi và đo lường performance của website
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

interface PerformanceData {
  pageLoad: PerformanceMetric;
  firstContentfulPaint: PerformanceMetric;
  largestContentfulPaint: PerformanceMetric;
  cumulativeLayoutShift: PerformanceMetric;
  firstInputDelay: PerformanceMetric;
}

/**
 * Class quản lý performance monitoring
 */
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
  }

  /**
   * Khởi tạo các performance observers
   */
  private initObservers(): void {
    // LCP Observer
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        this.recordMetric('LCP', lastEntry.startTime, 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as PerformanceEntry;
        this.recordMetric('FID', firstEntry.processingStart - firstEntry.startTime, 'ms');
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetric('CLS', clsValue, 'score');
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      this.observers.push(lcpObserver, fidObserver, clsObserver);
    }
  }

  /**
   * Ghi lại metric
   * @param name - Tên metric
   * @param value - Giá trị
   * @param unit - Đơn vị
   */
  private recordMetric(name: string, value: number, unit: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    };

    this.metrics.push(metric);
    this.logMetric(metric);
  }

  /**
   * Log metric ra console (có thể thay bằng analytics service)
   * @param metric - Metric cần log
   */
  private logMetric(metric: PerformanceMetric): void {
    console.log(`🚀 Performance: ${metric.name} = ${metric.value}${metric.unit}`);
    
    // Có thể gửi đến analytics service
    // this.sendToAnalytics(metric);
  }

  /**
   * Đo thời gian load page
   */
  public measurePageLoad(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.recordMetric('Page Load', loadTime, 'ms');
      });
    }
  }

  /**
   * Đo thời gian load component
   * @param componentName - Tên component
   * @param startTime - Thời gian bắt đầu
   */
  public measureComponentLoad(componentName: string, startTime: number): void {
    const loadTime = performance.now() - startTime;
    this.recordMetric(`${componentName} Load`, loadTime, 'ms');
  }

  /**
   * Đo thời gian API call
   * @param endpoint - API endpoint
   * @param startTime - Thời gian bắt đầu
   */
  public measureApiCall(endpoint: string, startTime: number): void {
    const responseTime = performance.now() - startTime;
    this.recordMetric(`API: ${endpoint}`, responseTime, 'ms');
  }

  /**
   * Lấy tất cả metrics
   * @returns Danh sách metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Lấy metric theo tên
   * @param name - Tên metric
   * @returns Metric hoặc undefined
   */
  public getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.find(m => m.name === name);
  }

  /**
   * Xóa tất cả metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Cleanup observers
   */
  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook để đo performance của component
 * @param componentName - Tên component
 */
export function usePerformanceMeasure(componentName: string): () => void {
  const startTime = performance.now();
  
  return () => {
    performanceMonitor.measureComponentLoad(componentName, startTime);
  };
}

/**
 * Utility function để đo API call
 * @param endpoint - API endpoint
 * @param apiCall - Function API call
 */
export async function measureApiCall<T>(
  endpoint: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    performanceMonitor.measureApiCall(endpoint, startTime);
    return result;
  } catch (error) {
    performanceMonitor.measureApiCall(`${endpoint} (error)`, startTime);
    throw error;
  }
}
