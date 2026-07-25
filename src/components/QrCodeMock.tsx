function finderCell(row: number, column: number, startRow: number, startColumn: number) {
  const localRow = row - startRow;
  const localColumn = column - startColumn;
  if (localRow < 0 || localRow > 6 || localColumn < 0 || localColumn > 6) {
    return null;
  }
  const border =
    localRow === 0 || localRow === 6 || localColumn === 0 || localColumn === 6;
  const center =
    localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4;
  return border || center;
}

export default function QrCodeMock({ value }: { value: string }) {
  const size = 25;
  const cells = Array.from({ length: size * size }, (_, index) => {
    const row = Math.floor(index / size);
    const column = index % size;
    const finder =
      finderCell(row, column, 1, 1) ??
      finderCell(row, column, 1, size - 8) ??
      finderCell(row, column, size - 8, 1);
    const char = value.charCodeAt((row * 7 + column * 11) % value.length);
    const dark = finder ?? ((row * column + char + row + column) % 7 < 3);
    return <span key={index} className={dark ? "dark" : ""} />;
  });

  return (
    <div
      className="qr-code"
      role="img"
      aria-label="QR Code PIX de demonstração"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {cells}
    </div>
  );
}
