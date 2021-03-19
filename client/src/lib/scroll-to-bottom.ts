export default function scrollToBottom(element: HTMLDivElement) {
  element.scrollTo({
    top: element.scrollHeight + 1000,
  });
}
