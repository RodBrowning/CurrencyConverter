import './style.scss';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import currenciesFlags from './flags';

interface Props {
  currency: string;
}

const Flag: React.FC<Props> = ({ currency }) => {
  const flagContainerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number>(0);
  const [flags, setFlags] = useState<string[]>(currenciesFlags[currency]);

  useEffect(() => {
    setFlags([...currenciesFlags[currency]]);
    setIndex(0);
  }, [currency]);

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
