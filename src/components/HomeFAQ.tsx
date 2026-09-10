import { useState } from 'react';
import { Plus } from 'lucide-react';

const questions = [
  { question: 'What does this platform do?', answer: 'It helps you examine a business decision before committing time or money. You can explore the assumptions behind a plan, potential risks, financial metrics, and practical experiments to validate your next step.' },
  { question: 'How does the analysis work?', answer: 'Start by describing your decision and, optionally, adding financial inputs. The intended workflow combines AI assumption analysis, relevant business cases, financial calculations, and validation suggestions in a report. This preview currently uses sample analysis reports; financial metrics are calculated from the numbers you enter.' },
  { question: 'What data does it use?', answer: 'The project’s datasets include IDX financial benchmarks, company profiles, and startup failure cases. These are intended to provide industry context and relevant comparisons. They are not connected to this preview yet, so the cases and sources currently shown in reports are demo content.' },
  { question: 'Do I need to provide financial data?', answer: 'Only the decision statement is required to start. Financial inputs help you explore margins, operating profit, cash burn, and runway. This preview has example numbers already filled in: replace them with figures for your scenario if you want the financial results to reflect your business.' },
  { question: 'What does evidence coverage mean?', answer: 'Evidence coverage is the percentage of identified assumptions marked as well supported by direct evidence. A similar company or an industry benchmark can provide useful context, but does not automatically prove an assumption about your business. A score of 0% means none of the assumptions are marked as well supported, not that your decision will fail.' },
  { question: 'Does it predict whether my decision will succeed?', answer: 'No. The report helps you examine risks, identify missing evidence, and decide what to test next. It does not guarantee success or failure. Treat the findings as a starting point for investigation and validate them against your own business data.' },
];

export default function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-32 border-t border-slate-400/20 bg-[#20334b]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Questions &amp; answers</p>
          <h2 id="faq-heading" className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-200">Learn how to use the platform, what data it uses, and what your results mean.</p>
        </div>
        <div className="divide-y divide-slate-400/25 border-y border-slate-400/25">
          {questions.map(({ question, answer }, index) => (
            <div key={question}>
              <h3>
                <button id={`faq-question-${index}`} type="button" aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen((current) => current === index ? null : index)} className="flex w-full items-center justify-between gap-5 rounded-sm py-5 text-left text-base font-semibold text-white transition-colors hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
                  {question}
                  <Plus aria-hidden="true" className={`h-5 w-5 shrink-0 text-cyan-200 transition-transform duration-200 motion-reduce:transition-none ${open === index ? 'rotate-45' : ''}`} />
                </button>
              </h3>
              <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={open !== index} className={`assumption-disclosure ${open === index ? 'is-open' : ''}`}>
                <div className="min-h-0 overflow-hidden"><p className="pb-5 pr-6 text-base leading-relaxed text-slate-200">{answer}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
