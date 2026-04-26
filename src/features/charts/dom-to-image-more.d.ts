declare module 'dom-to-image-more' {
  function toPng(node: HTMLElement, options?: object): Promise<string>

  function toJpeg(node: HTMLElement, options?: object): Promise<string>

  function toBlob(node: HTMLElement, options?: object): Promise<Blob>

  function toSvg(node: HTMLElement, options?: object): Promise<string>
}
