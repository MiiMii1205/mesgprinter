import type { MesgPrinterMessageTypes } from "./MesgPrinterMessageTypes";

export interface IMessageOptions {
    
    ressourceName: string;
    ressourceColor: ColorArray;
    holdTime: number;
    
}

export interface IMesgPrinterMessageEventArgs {
    
    message: string;
    params: IMessageOptions;
    type: MesgPrinterMessageTypes;
    
}