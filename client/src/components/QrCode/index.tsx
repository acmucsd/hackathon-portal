import QRCode, { BitMatrix } from 'qrcode';
import styles from './style.module.scss';
import { useMemo } from 'react';

const RADIUS = 0.9;

function getFinderSize(modules: BitMatrix): number {
  let finderSize = 0;
  for (let i = 0; i < modules.size; i++) {
    if (!modules.get(0, i)) {
      break;
    }
    finderSize++;
  }
  return finderSize;
}

interface QrCodeProps {
  data: string;
}

const QrCode = ({ data }: QrCodeProps) => {
  const code = useMemo(() => QRCode.create(data).modules, [data]);
  const finderSize = getFinderSize(code);
  console.log(code);

  console.log(finderSize);

  return (
    <div className={styles.gradient}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        viewBox={`-2 -2 ${(code.size + 2) * 2} ${(code.size + 2) * 2}`}
      >
        <path
          d={Array.from({ length: code.size }, (_, row) =>
            Array.from({ length: code.size }, (_, col) =>
              code.get(row, col) &&
              !(
                (row < finderSize && (col < finderSize || col >= code.size - finderSize)) ||
                (row >= code.size - finderSize && col < finderSize)
              )
                ? `M ${col * 2 + 1 - RADIUS} ${row * 2 + 1} a ${RADIUS} ${RADIUS} 0 0 0 ${2 * RADIUS} 0 a ${RADIUS} ${RADIUS} 0 0 0 ${-2 * RADIUS} 0 z`
                : null
            )
          )
            .flat()
            .join('')}
        />
        <rect
          x={1}
          y={1}
          width={(finderSize - 1) * 2}
          height={(finderSize - 1) * 2}
          className={styles.finderOutline}
        />
        <rect
          x={1}
          y={(code.size - finderSize) * 2 + 1}
          width={(finderSize - 1) * 2}
          height={(finderSize - 1) * 2}
          className={styles.finderOutline}
        />
        <rect
          x={(code.size - finderSize) * 2 + 1}
          y={1}
          width={(finderSize - 1) * 2}
          height={(finderSize - 1) * 2}
          className={styles.finderOutline}
        />
        <rect
          x={4}
          y={4}
          width={(finderSize - 4) * 2}
          height={(finderSize - 4) * 2}
          className={styles.finderCenter}
        />
        <rect
          x={(code.size - (finderSize - 2)) * 2}
          y={4}
          width={(finderSize - 4) * 2}
          height={(finderSize - 4) * 2}
          className={styles.finderCenter}
        />
        <rect
          x={4}
          y={(code.size - (finderSize - 2)) * 2}
          width={(finderSize - 4) * 2}
          height={(finderSize - 4) * 2}
          className={styles.finderCenter}
        />
      </svg>
    </div>
  );
};

export default QrCode;
