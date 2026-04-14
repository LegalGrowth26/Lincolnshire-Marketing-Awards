'use client'

import { useState } from 'react'

export interface FAQItem {
  question: string
  answer:   string
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="space-y-3" role="list">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx
        return (
          <div
            key={idx}
            role="listitem"
            className="border border-gray-200 rounded-sm overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-4 p-5 text-left
                         hover:bg-gray-50 transition-colors duration-150 group"
            >
              <span className="font-semibold text-navy-900 text-sm md:text-base leading-snug">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2
                            border-gold-500 flex items-center justify-center text-gold-500
                            transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-5 pb-5 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {item.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
