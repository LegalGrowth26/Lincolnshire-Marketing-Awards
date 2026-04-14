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
            className="rounded-sm overflow-hidden transition-all duration-300"
            style={{
              background: isOpen
                ? 'linear-gradient(145deg, #ffffff 0%, #f0f5ff 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f4f8ff 100%)',
              border: isOpen
                ? '1px solid rgba(40,200,255,0.22)'
                : '1px solid rgba(20,88,186,0.1)',
              boxShadow: isOpen
                ? '0 4px 20px rgba(10,45,110,0.08), 0 0 0 1px rgba(40,200,255,0.1)'
                : '0 1px 4px rgba(10,45,110,0.05)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-4 p-5 text-left
                         transition-colors duration-200 group"
            >
              <span className="font-semibold text-navy-900 text-sm md:text-base leading-snug">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center
                            justify-center transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}
                style={{
                  background: isOpen
                    ? 'linear-gradient(135deg, #28c8ff, #00aee6)'
                    : 'transparent',
                  border: isOpen
                    ? 'none'
                    : '1.5px solid rgba(40,200,255,0.5)',
                  color: isOpen ? '#071d52' : '#28c8ff',
                }}
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
              <div
                className="px-5 pb-5 text-sm md:text-base text-gray-600 leading-relaxed pt-4"
                style={{ borderTop: '1px solid rgba(20,88,186,0.08)' }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
