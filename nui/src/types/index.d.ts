declare function GetParentResourceName(): string;

declare type ColorArray = [number, number, number]

declare type MesgPrinterEventNames = "printerReady";

declare module "*.pug" {
    interface LocalsObject {
        [propName: string]: any;
    }
    
    export default function compileTemplate(locals?: LocalsObject): string;
}