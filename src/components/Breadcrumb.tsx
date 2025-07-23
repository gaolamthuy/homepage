import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const ChevronRight = () => (
  <svg
    className="w-4 h-4 mx-1 text-muted-foreground"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav
      className={`py-3 px-2 md:px-0 flex items-center ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center text-sm">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight />}
            {item.href && idx !== items.length - 1 ? (
              <a
                href={item.href}
                className="font-medium text-primary hover:underline transition-colors duration-150"
              >
                {item.label}
              </a>
            ) : (
              <span className="font-semibold text-foreground">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
