import type { IMesgPrinterMessageEventArgs, IMessageOptions } from "./IMessageOptions";
import msgTemplate from "../views/msg-row.pug";
import { tools } from "./Tools";
import MarkdownIt from "markdown-it";
import twemoji from "twemoji";
import markdownItEmoji from "markdown-it-emoji";
import type Token from "markdown-it/lib/token";
import { mesgPrinterConstants } from "./IMesgPrinterConstants";
import { MesgPrinterMessageTypes } from "./MesgPrinterMessageTypes";
import { Collapse } from "bootstrap";

export class MessageController {
    
    private static readonly COLLAPSE_TIME: number = (0.35 * 1000);
    private static inst: MessageController;
    private static readonly EMOJI_PARAMS: Partial<twemoji.ParseObject> = {
        folder : "svg",
        ext : ".svg"
    };
    private static readonly PARENT_RESOURCE_NAME: string = GetParentResourceName();
    private readonly m_mesgQueue: Element;
    private readonly m_markdown: MarkdownIt;
    
    private constructor(context: Window) {
        context.addEventListener("message", this.manageMessage.bind(this));
        this.m_mesgQueue = document.getElementById("mesg-queue");
        this.m_markdown = new MarkdownIt({
            html : true,
            xhtmlOut : true,
            breaks : true,
            typographer : true
        });
        
        this.m_markdown.use(markdownItEmoji);
        this.m_markdown.renderer.rules.emoji = (token: Token[], idx: number): string => twemoji.parse(token[idx].content, MessageController.EMOJI_PARAMS);
    }
    
    public static get instance(): MessageController {
        if (MessageController.inst == null) {
            MessageController.inst = new MessageController(window);
        }
        
        return MessageController.inst;
    }
    
    public static init(): void {
        fetch(`https://${MessageController.PARENT_RESOURCE_NAME}/${mesgPrinterConstants.PRINTER_READY_EVENT_NAME}`, {
            method : "POST",
            headers : {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "Content-Type" : "application/json; charset=UTF-8"
            },
            body : JSON.stringify({ code : 200 })
        }).then((): void => {
            MessageController.inst = MessageController.instance;
        }).catch(console.error);
    }
    
    private manageMessage(e: MessageEvent<IMesgPrinterMessageEventArgs>): void {
        switch (e.data.type) {
            case MesgPrinterMessageTypes.ADD_MESSAGE:
                this.addMessage(e.data.message, e.data.params);
                break;
            case MesgPrinterMessageTypes.ADD_ERROR:
                this.addError(e.data.message, e.data.params);
                break;
            case MesgPrinterMessageTypes.ADD_WARN:
                this.addWarn(e.data.message, e.data.params);
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`${e.data.type} is not a valid event`);
        }
    }
    
    private addMessage(msg: string, params: IMessageOptions): void {
        return this.addNewMessage(msg, "text-light", params);
    }
    
    private addError(msg: string, params: IMessageOptions): void {
        return this.addNewMessage(msg, "text-danger font-weight-bold", params);
    }
    
    private addWarn(msg: string, params: IMessageOptions): void {
        return this.addNewMessage(msg, "text-warning font-weight-bold", params);
    }
    
    private addNewMessage(msg: string, msgClass: string, {
        ressourceName,
        ressourceColor,
        holdTime
    }: IMessageOptions): void {
        const el: Element = this.m_mesgQueue.insertBefore(tools.parseToHTML(msgTemplate({
            id : `${ressourceName}_${Date.now()}`,
            ressourceName,
            rgbHex : tools.rgbToHex(ressourceColor[0], ressourceColor[1], ressourceColor[2]),
            msgClass,
            msg : this.m_markdown.render(msg),
            msgTextColorClass : tools.getContrastingColor(ressourceColor, "badge-dark", "badge-light")
        })), this.m_mesgQueue.firstChild);
        
        const collapsable: Collapse = new Collapse(el, {
            toggle : false
        });
        
        el.addEventListener("shown.bs.collapse", (): void => {
            el.addEventListener("hidden.bs.collapse", (): void => {
                collapsable.dispose();
                el.parentElement.removeChild(el);
            }, { once : true });
        }, { once : true });
        
        collapsable.hide();
        
        setTimeout((): void => {
            collapsable.hide();
        }, holdTime + MessageController.COLLAPSE_TIME);
        
        setTimeout((): void => {
            collapsable.show();
        }, 1);
    }
    
}