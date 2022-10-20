import './style.scss';

import React, { useEffect, useRef, useState } from 'react';

import currenciesFlags from './flags';

interface Props {
  currencySymbol: string;
}

const Flag: React.FC<Props> = ({ currencySymbol }) => {
  const flagContainerRef = useRef<HTMLDivElement>(null);
  const [flags, setFlags] = useState<string[]>(currenciesFlags[currencySymbol]);

  useEffect(() => {
    setFlags([...currenciesFlags[currencySymbol]]);
  }, [currencySymbol]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let index = 0;
    flagContainerRef.current?.children[index].classList.add('show');
    if (flags.length > 1) {
      const interval = setInterval(() => {
        flagContainerRef.current?.children[index].classList.remove('show');
        if (index < flags.length - 1) {
          index += 1;
        } else {
          index = 0;
        }
        flagContainerRef.current?.children[index].classList.add('show');
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [flags]);

  return (
    <div className="flags-container" ref={flagContainerRef}>
      {flags.map((flag) => {
        return (
          <div
            className="flag"
            key={flag}
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}assets/flags/${flag})`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Flag;
