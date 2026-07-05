import React, { useMemo } from 'react';

function splitString(text) {
  return [...text].map((ch, i) => (
    <span key={i} className="char" aria-hidden="true">
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  ));
}

function walkChildren(children) {
  return React.Children.map(children, (child, i) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <React.Fragment key={i}>{splitString(String(child))}</React.Fragment>;
    }
    if (React.isValidElement(child)) {
      if (child.type === 'br') return child;
      return React.cloneElement(child, { key: i }, walkChildren(child.props.children));
    }
    return child;
  });
}

export function SplitText({ children, className = '' }) {
  const nodes = useMemo(() => walkChildren(children), [children]);
  return (
    <span className={className} data-split="true">
      {nodes}
    </span>
  );
}
