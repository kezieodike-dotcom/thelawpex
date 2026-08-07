import React from 'react';
import { parseInline, parseProse } from '../lib/prose';

/** Renders the markdown-lite article bodies used across LAWPEX. */
export const ProseView: React.FC<{ body: string; className?: string }> = ({
  body,
  className = '',
}) => (
  <div className={`space-y-4 ${className}`}>
    {parseProse(body).map((block, index) => {
      if (block.kind === 'heading') {
        return (
          <h4
            key={index}
            className="text-sm font-black font-serif text-yellow-700 pt-2 first:pt-0"
          >
            {block.text}
          </h4>
        );
      }

      if (block.kind === 'bullets') {
        return (
          <ul key={index} className="space-y-1.5">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-2 text-xs text-neutral-700 leading-relaxed">
                <span className="text-yellow-700 shrink-0">•</span>
                <span>
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={index} className="text-xs text-neutral-700 leading-relaxed">
          <Inline text={block.text} />
        </p>
      );
    })}
  </div>
);

const Inline: React.FC<{ text: string }> = ({ text }) => (
  <>
    {parseInline(text).map((run, index) =>
      run.bold ? (
        <strong key={index} className="text-neutral-900 font-bold">
          {run.text}
        </strong>
      ) : (
        <React.Fragment key={index}>{run.text}</React.Fragment>
      ),
    )}
  </>
);
