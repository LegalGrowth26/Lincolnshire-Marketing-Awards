import FAQAccordion from '@/components/ui/FAQAccordion'

const faqs = [
  {
    question: 'Is it free to enter the Lincolnshire Marketing Awards?',
    answer: 'Yes — entering the Lincolnshire Marketing Awards is completely free. There is no entry fee, no membership required, and no hidden costs. The awards exist to recognise genuine achievement, not to be a revenue stream.',
  },
  {
    question: 'How many categories can I enter?',
    answer: 'You can enter a maximum of 3 award categories per business. Each category requires a separate submission, so take time to choose the categories that best reflect your achievements.',
  },
  {
    question: 'Who is eligible to enter?',
    answer: 'Entries are open to businesses based in or primarily operating in Lincolnshire. This includes sole traders, partnerships, limited companies, social enterprises, and charities with a commercial element. There is no minimum size requirement.',
  },
  {
    question: 'How long should my entry be?',
    answer: 'Entries should be no more than 1,000 words per category. We recommend being concise and evidence-led rather than filling every word. Quality over quantity — judges appreciate clear, specific, substantiated claims.',
  },
  {
    question: 'Who judges the awards?',
    answer: 'All entries are assessed by an independent judging panel of experienced Lincolnshire business professionals. Every submission receives scores from three separate judges. The organising team has no involvement in scoring or deciding winners.',
  },
  {
    question: 'How do you ensure the judging is fair?',
    answer: 'Every judge completes a conflict of interest declaration before judging begins. Any judge with a personal or commercial connection to an entrant is recused from that entry. Scores from three judges are averaged, and the highest overall score wins. Sponsoring the awards does not influence results.',
  },
  {
    question: 'Can I enter if I have sponsored the awards?',
    answer: 'Yes. Sponsors are eligible to enter categories. However, their entries are judged by the same independent panel using the same criteria. Sponsorship has absolutely no bearing on judging outcomes.',
  },
  {
    question: 'What happens after I submit my entry?',
    answer: 'You\'ll receive a confirmation email with your entry reference. Your submission then goes to the independent judging panel in August 2026. Shortlisted finalists are notified privately first, then announced publicly in late August.',
  },
  {
    question: 'Do I need to attend the awards night to win?',
    answer: 'Winners are announced at the awards dinner on the night. We strongly encourage finalists to attend — it\'s a fantastic evening and you\'ll want to be there if your name is called. However, winning is not conditional on attendance.',
  },
  {
    question: 'What is the Business Recognition Award?',
    answer: 'The Business Recognition Award is a special peer-nominated category. You cannot self-nominate — businesses and individuals are put forward by clients, peers, or the public. It recognises outstanding contributions to the wider Lincolnshire business community.',
  },
  {
    question: 'Can I enter as an individual rather than a business?',
    answer: 'Certain categories — such as Entrepreneur of the Year and Rising Star Award — are designed to recognise individuals. You can enter these as an individual business owner, director, or emerging talent, even if your business is also entering other categories.',
  },
  {
    question: 'When will the shortlist be announced?',
    answer: 'Shortlisted finalists will be announced in late August 2026. All finalists will be notified privately before the public announcement, and will receive promotional assets to share across their own channels.',
  },
  {
    question: 'How do I find out about tickets for the awards night?',
    answer: 'Ticket information will be released following the shortlist announcement in late August. Shortlisted businesses receive priority access. Register your interest by emailing hello@lincolnshiremarketing.co.uk.',
  },
]

export default function FAQs() {
  return (
    <section id="faqs" aria-labelledby="faqs-heading" className="section-py bg-white">
      <div className="container-wide">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Left — Header */}
          <div className="lg:col-span-1">
            <span className="section-label">FAQs</span>
            <h2 id="faqs-heading" className="section-title mb-5">
              Frequently Asked Questions
            </h2>
            <div className="gold-divider mb-6" aria-hidden="true" />
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Everything you need to know about entering, judging, and attending the
              Lincolnshire Marketing Awards 2026.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Can&apos;t find what you&apos;re looking for? Get in touch — we&apos;re happy to help.
            </p>
            <a
              href="mailto:hello@lincolnshiremarketing.co.uk"
              className="btn-outline-navy text-xs py-3"
            >
              Ask Us Directly
            </a>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <a href="#enter" className="btn-gold text-xs py-3 w-full text-center">
                Enter the Awards — Free
              </a>
            </div>
          </div>

          {/* Right — Accordion */}
          <div className="lg:col-span-2">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </div>
    </section>
  )
}
