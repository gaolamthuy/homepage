/**
 * Structured Data Component
 * Tạo JSON-LD structured data cho SEO
 */

import React from 'react';
import type { Product, Category } from '@/types/shop';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    contactType: string;
  };
}

interface ProductStructuredDataProps {
  product: Product;
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Component tạo Organization structured data
 * @param data - Thông tin tổ chức
 */
export const OrganizationStructuredData: React.FC<{ data: OrganizationData }> = ({ data }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "url": data.url,
    "logo": data.logo,
    "description": data.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.address.streetAddress,
      "addressLocality": data.address.addressLocality,
      "addressRegion": data.address.addressRegion,
      "postalCode": data.address.postalCode,
      "addressCountry": data.address.addressCountry
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": data.contactPoint.telephone,
      "contactType": data.contactPoint.contactType
    },
    "sameAs": [
      "https://facebook.com/gaolamthuy",
      "https://zalo.me/567000711935281744"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

/**
 * Component tạo Product structured data
 * @param product - Thông tin sản phẩm
 */
export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({ product }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "Gạo Lâm Thúy"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "VND",
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Gạo Lâm Thúy"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    },
    "category": product.category
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

/**
 * Component tạo Breadcrumb structured data
 * @param items - Danh sách breadcrumb items
 */
export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ items }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

/**
 * Component tạo Website structured data
 */
export const WebsiteStructuredData: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gạo Lâm Thúy",
    "url": "https://gaolamthuy.vn",
    "description": "Website bán gạo sạch, chất lượng cao, giao hàng tận nơi toàn quốc",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gaolamthuy.vn/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

/**
 * Component tạo LocalBusiness structured data
 */
export const LocalBusinessStructuredData: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gạo Lâm Thúy",
    "image": "https://gaolamthuy.vn/logo-main-hexagon-extrawhiteborder-forproductimage.svg",
    "description": "Cửa hàng bán gạo sạch, chất lượng cao",
    "url": "https://gaolamthuy.vn",
    "telephone": "0901467300",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "23 Nguyễn Đình Chiểu",
      "addressLocality": "Phường 4",
      "addressRegion": "Quận Phú Nhuận",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.7967",
      "longitude": "106.6894"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
