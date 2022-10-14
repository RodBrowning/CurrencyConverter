import './style.scss';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import currenciesFlags from './flags';

interface Props {
  currencySymbol: string;
}

const Flag: React.FC<Props> = ({ currencySymbol }) => {
  const flagContainerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number>(0);
  const [flags, setFlags] = useState<string[]>(currenciesFlags[currencySymbol]);

  useEffect(() => {
    setFlags([...currenciesFlags[currencySymbol]]);
    setIndex(0);
  }, [currencySymbol]);

  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    flagContainerRef!.current!.children[index].classList.add('show');
    if (flags.length > 1) {
      const timeOut = setTimeout(() => {
        flagContainerRef!.current!.children[index].classList.remove('show');
        if (index < flags.length - 1) {
          setIndex((oldIndex) => {
            return oldIndex + 1;
          });
        } else {
          setIndex(0);
        }
      }, 10000);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [flags, index]);

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
