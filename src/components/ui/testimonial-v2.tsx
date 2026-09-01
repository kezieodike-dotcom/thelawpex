import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BadgeCheck } from 'lucide-react';

interface Testimonial {
  text: string;
  initials: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: 'LAWPEX turns raw legal research into a usable brief structure. Facts, issues, ratio and authorities are already separated before my juniors begin drafting.',
    initials: 'CO',
    name: 'Chinonso Okafor',
    role: 'Legal Practitioner, Lagos',
  },
  {
    text: 'The Court of Appeal and Supreme Court reports are easier to scan. I can move from the principle to the whole judgment without losing the thread of the case.',
    initials: 'AM',
    name: 'Adaeze Mba',
    role: 'Appellate Counsel',
  },
  {
    text: 'The Word-ready exports save our chambers time. We use the case notes and affidavit templates as a reliable first draft, then settle them for filing.',
    initials: 'AE',
    name: 'Amaka Eze',
    role: 'Managing Partner, Eze & Associates',
  },
  {
    text: 'For courtroom preparation, the practicals are the strongest part. They remind counsel what to say, when to rise, and what rule supports each step.',
    initials: 'NU',
    name: 'Nnamdi Udo',
    role: 'Trial Lawyer, Port Harcourt',
  },
  {
    text: 'I like that the AI assistant is guarded. It helps with structure and authorities but keeps telling users to verify every citation before relying on it.',
    initials: 'HM',
    name: 'Hon. Justice A. B. Mustapha',
    role: 'High Court Judge',
  },
  {
    text: 'The areas-of-law workflow feels close to how litigation happens in practice: demand letter, originating process, response, objection, laws and authorities.',
    initials: 'FB',
    name: 'Fatima Bello',
    role: 'Head of Litigation',
  },
  {
    text: 'Our interns learn faster with LAWPEX because they can see the anatomy of a Nigerian court process instead of copying forms blindly.',
    initials: 'OO',
    name: 'Oghenetega Omoregie',
    role: 'Principal Partner, Benin City',
  },
  {
    text: 'The Nigerian laws and court rules sections reduce context switching. I can check the rule, open a draft and compare authorities in the same workspace.',
    initials: 'TS',
    name: 'Tari Sani',
    role: 'Corporate Litigation Associate',
  },
  {
    text: 'It feels purpose-built for Nigerian practice. The citation format, court hierarchy and practical notes are the details that make it useful every day.',
    initials: 'IE',
    name: 'Ifeoma Ekwueme',
    role: 'Legal Research Lead',
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn: React.FC<{
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}> = ({ className, testimonials, duration = 16 }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
  <div className={className}>
    <motion.ul
      animate={shouldReduceMotion ? undefined : { translateY: '-50%' }}
      transition={shouldReduceMotion ? undefined : {
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      className="m-0 flex list-none flex-col gap-5 bg-transparent p-0 pb-5"
    >
      {new Array(2).fill(0).map((_, setIndex) => (
        <React.Fragment key={setIndex}>
          {testimonials.map(({ text, initials, name, role }, index) => (
            <motion.li
              key={`${setIndex}-${name}-${index}`}
              aria-hidden={setIndex === 1}
              tabIndex={setIndex === 1 ? -1 : 0}
              whileHover={{
                scale: 1.025,
                y: -8,
                transition: { type: 'spring', stiffness: 360, damping: 22 },
              }}
              whileFocus={{
                scale: 1.025,
                y: -8,
                transition: { type: 'spring', stiffness: 360, damping: 22 },
              }}
              className="lawpex-testimonial-card w-full max-w-sm cursor-default select-none rounded-lg border border-[#181411]/10 bg-white p-6 outline-none focus:ring-2 focus:ring-amber-300/60 sm:p-7"
            >
              <blockquote>
                <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified user
                </div>
                <p className="m-0 text-sm leading-7 text-neutral-700">{text}</p>
                <footer className="mt-6 flex items-center gap-3 border-t border-amber-100 pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#181411] text-xs font-black text-amber-300 ring-2 ring-amber-200">
                    {initials}
                  </span>
                  <div>
                    <cite className="block not-italic text-sm font-black tracking-tight text-neutral-950">
                      {name}
                    </cite>
                    <span className="mt-0.5 block text-xs font-semibold leading-5 text-neutral-500">
                      {role}
                    </span>
                  </div>
                </footer>
              </blockquote>
            </motion.li>
          ))}
        </React.Fragment>
      ))}
    </motion.ul>
  </div>
  );
};

export const TestimonialsSection: React.FC = () => (
  <section aria-labelledby="testimonials-heading" className="relative overflow-hidden bg-[#181411] py-16 text-white sm:py-20">
    <motion.div
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <div className="inline-flex border-l-4 border-[#f7c915] px-3 py-1 text-[11px] font-bold uppercase text-[#f7c915]">
          Testimonials
        </div>
        <h2
          id="testimonials-heading"
          className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
        >
          What our users say
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
          Nigerian lawyers, chambers and court-facing teams use LAWPEX to research faster, draft
          cleaner and keep authorities close to the work.
        </p>
      </div>

      <div
        className="mx-auto flex max-h-[720px] justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
        role="region"
        aria-label="Scrolling LAWPEX user testimonials"
      >
        <TestimonialsColumn testimonials={firstColumn} duration={18} />
        <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
        <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
      </div>
    </motion.div>
  </section>
);

export default TestimonialsSection;
