export function getScrollPercentage(element: HTMLDivElement) {
  return (
    (100 * element.scrollTop) / (element.scrollHeight - element.clientHeight)
  );
}
