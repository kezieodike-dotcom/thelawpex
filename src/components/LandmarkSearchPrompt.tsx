import React, { useEffect, useState } from 'react';
import caseCatalog from '../data/caseCatalog.json';

const LANDMARK_SEARCH_PROMPTS = caseCatalog
  .filter(({ isLandmark }) => isLandmark)
  .slice(0, 2)
  .map(({ title }) => title);

interface LandmarkSearchPromptProps {
  visible: boolean;
  className: string;
  testId: string;
}

export const LandmarkSearchPrompt: React.FC<LandmarkSearchPromptProps> = ({
  visible,
  className,
  testId,
}) => {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    if (!visible || LANDMARK_SEARCH_PROMPTS.length < 2) return;
    const timer = window.setInterval(() => {
      setPromptIndex((current) => (current + 1) % LANDMARK_SEARCH_PROMPTS.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [visible]);

  if (!visible || LANDMARK_SEARCH_PROMPTS.length === 0) return null;

  return (
    <span
      key={promptIndex}
      data-testid={testId}
      aria-hidden="true"
      className={`lawpex-case-search-prompt pointer-events-none flex min-w-0 items-center overflow-hidden ${className}`}
    >
      <span className="block min-w-0 truncate">
        {LANDMARK_SEARCH_PROMPTS[promptIndex]}
      </span>
    </span>
  );
};
