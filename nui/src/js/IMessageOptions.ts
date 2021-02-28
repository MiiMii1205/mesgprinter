import { MesgPrinterMessageTypes } from "./MesgPrinterMessageTypes";

export interface IMessageOptions {
    ressourceName: string;
    ressourceColor: ColorArray;
    holdTime: number;
}

export interface IMesgPrinterMessageEventArgs {
    message: any;
    params: IMessageOptions;
    type: MesgPrinterMessageTypes;
}