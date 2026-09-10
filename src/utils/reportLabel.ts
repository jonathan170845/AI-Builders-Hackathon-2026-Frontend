export function formatReportLabel(id: string): string {
  const number = /^(?:analysis|report)-(\d+)$/.exec(id)?.[1];
  return number ? `Report #${number}` : `Report ${id}`;
}
