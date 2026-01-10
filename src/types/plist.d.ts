declare module 'plist' {
  export function parse(xml: string): any
  export function build(obj: any): string
}
