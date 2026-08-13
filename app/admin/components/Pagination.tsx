"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemLabel?: string; // e.g. "portfolio", "layanan", "logo klien"
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = "data",
  onPageChange,
}: PaginationProps) {
  if (totalItems <= itemsPerPage || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with ellipsis if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-200 text-xs sm:text-sm">
      {/* Information string */}
      <p className="text-slate-500 font-medium text-center sm:text-left">
        Menampilkan <span className="font-bold text-slate-900">{startItem}-{endItem}</span> dari <span className="font-bold text-slate-900">{totalItems}</span> {itemLabel}
      </p>

      {/* Control buttons */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-1.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Halaman sebelumnya"
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
            <span>Sebelumnya</span>
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span key={`dots-${idx}`} className="px-2 text-slate-400 font-bold select-none">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Halaman ${page}`}
                aria-current={isActive ? "page" : undefined}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Halaman berikutnya"
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <span>Selanjutnya</span>
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
