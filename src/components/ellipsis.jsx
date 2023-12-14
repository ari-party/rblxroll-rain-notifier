import { useEffect, useState } from 'react';
import propTypes from 'prop-types';

function Ellipsis({ prefix }) {
  const [ellipsis, setEllipsis] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      if (ellipsis.length === 3) {
        setEllipsis('.');
      } else {
        setEllipsis(ellipsis + '.');
      }
    }, 615);

    return () => clearInterval(interval);
  });

  return (prefix || '') + ellipsis;
}

Ellipsis.propTypes = {
  prefix: propTypes.string,
};

export default Ellipsis;
