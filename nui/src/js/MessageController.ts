import { IMesgPrinterMessageEventArgs, IMessageOptions } from "./IMessageOptions";
import $ from "jquery";
import msgTemplate from "../views/msg-row.pug";
import { Tools } from "./tools";
import MarkdownIt from "markdown-it";
import twemoji from "twemoji";
import markdownItEmoji from "markdown-it-emoji";
import Token from "markdown-it/lib/token";
import { MesgPrinterConstants } from "./IMesgPrinterConstants";

export class MessageController {
    
    private static readonly COLLAPSE_TIME: number = (0.35 * 1000);
    private static inst: MessageController;
    private static readonly EMOJI_PARAMS: Partial<twemoji.ParseObject> = {
        folder : 'svg',
        ext : '.svg'
    };
    private static readonly PARENT_RESOURCE_NAME: string = GetParentResourceName();
    private mesgQueue: JQuery<HTMLElement>;
    private markdown: MarkdownIt;
    
    private constructor(context: Window) {
        context.addEventListener('message', (e) => {this.manageMessage(e)})
        let markdown = new MarkdownIt({
            html : true,
            xhtmlOut : true,
            breaks : true,
            typographer : true
        })
        
        markdown.use(markdownItEmoji)
        markdown.renderer.rules.emoji = (token: Token[], idx: number) => twemoji.parse(token[idx].content, MessageController.EMOJI_PARAMS);
        
        this.markdown = markdown;
        this.mesgQueue = $('#mesg-queue');
        
    }
    
    public static get instance() {
        if (MessageController.inst == null) {
            MessageController.inst = new MessageController(window);
        }
        
        return MessageController.inst;
    }
    
    public static init(): void {
        fetch(`https://${MessageController.PARENT_RESOURCE_NAME}/${MesgPrinterConstants.PRINTER_READY_EVENT_NAME}`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8',
            },
            body : JSON.stringify({ code : 200 })
        }).then(() => {
            MessageController.inst = MessageController.instance;
        }).catch(console.error);
    }
    
    private manageMessage(e: MessageEvent<IMesgPrinterMessageEventArgs>): void {
        
        switch (e.data.type) {
            case "AddMessage":
                this.addMessage(e.data.message, e.data.params);
                break;
            case "AddError" :
                this.addError(e.data.message, e.data.params);
                break;
            case "AddWarn" :
                this.addWarn(e.data.message, e.data.params);
                break;
            default:
                throw new Error(`${e.data.type} is not a valid event`);
        }
        
    }
    
    private addMessage(msg: any, params: IMessageOptions): void {
        return this.addNewMessage(msg, 'text-light', params);
    }
    
    private addError(msg: any, params: IMessageOptions): void {
        return this.addNewMessage(msg, 'text-danger text-bold', params);
    }
    
    private addWarn(msg: any, params: IMessageOptions): void {
        return this.addNewMessage(msg, 'text-warning text-bold', params);
    }
    
    private addNewMessage(msg: any, msgClass: string, {
        ressourceName,
        ressourceColor,
        holdTime
    }: IMessageOptions): void {
        let el = $(msgTemplate({
            id : `${ressourceName}_${Date.now()}`,
            ressourceName,
            rgbHex : Tools.rgbToHex(ressourceColor[0], ressourceColor[1], ressourceColor[2]),
            msgClass,
            msg : this.markdown.render(msg),
            msgTextColorClass : Tools.getContrastingColor(ressourceColor, "badge-dark", "badge-light")
        })).one('shown.bs.collapse', function (): void {
            $(this).one('hidden.bs.collapse', function (): void {
                $(this).remove();
            })
        }).prependTo(this.mesgQueue).collapse('hide');
        
        setTimeout(() => {
            el.collapse('hide')
        }, holdTime + MessageController.COLLAPSE_TIME)
        
        setTimeout(() => {
            el.collapse('show');
        }, 1)
        
    }
    
}