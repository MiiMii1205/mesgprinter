// eslint-disable-next-line @typescript-eslint/naming-convention
declare function GetParentResourceName(): string;

declare type ColorArray = [number, number, number];

declare type MesgPrinterEventNames = "printerReady";

declare module "*.pug" {
    type LocalsObject = Record<string, unknown>;
    
    export default function compileTemplate(locals?: LocalsObject): string;
}