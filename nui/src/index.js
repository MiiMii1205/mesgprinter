const $ = require( "jquery" );
const twemoji = require( "twemoji" );
require('bootstrap/dist/js/bootstrap.bundle');

const markdown = require('markdown-it')({
    html : true,
    xhtmlOut : true,
    breaks: true,
    typographer: true
})

const msgTemplate = require("./views/msg-row.pug")
const tools = require("./js/tools");

const EMOJI_PARAMS = {
    folder : 'svg',
    ext : '.svg'
};

const MESG_QUEUE = $('#mesg-queue');
const COLLAPSE_TIME = (0.35 * 1000);

markdown.use(require('markdown-it-emoji'))
markdown.renderer.rules.emoji = (token, idx) => twemoji.parse(token[idx].content, EMOJI_PARAMS);

document.body.onload = () => {
    fetch(`https://${GetParentResourceName()}/printerReady`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json; charset=UTF-8',
        },
        body : JSON.stringify({ code : 200 })
    }).then(resp => resp.json()).catch(console.error);
}


function addNewMessage(msg, msgClass, {
    ressourceName,
    ressourceColor,
    holdTime
}) {
    let el = $(msgTemplate({
        id : `${ressourceName}_${Date.now()}`,
        ressourceName,
        rgbHex : tools.rgbToHex(ressourceColor[0], ressourceColor[1], ressourceColor[2]),
        msgClass,
        msg : markdown.render(msg),
        msgTextColorClass : tools.getContrastingColor(ressourceColor, "badge-dark", "badge-light")
    })).one('shown.bs.collapse', function () {
        $(this).one('hidden.bs.collapse', function () {
            $(this).remove();
        })
    }).prependTo(MESG_QUEUE).collapse('hide')
    
    setTimeout(() => {
        el.collapse('hide');
    }, holdTime + COLLAPSE_TIME)
    
    setTimeout(() => {
        el.collapse('show')
    }, 1)
    
}

function addMessage(msg, params) {
    return addNewMessage(msg, 'text-light', params);
}

function addError(msg, params) {
    return addNewMessage(msg, 'text-danger text-bold', params);
}

function addWarn(msg, params) {
    return addNewMessage(msg, 'text-warn text-bold', params);
}

window.addEventListener('message', (e) => {
    
    switch (e.data.type) {
        case "AddMessage":
            addMessage(e.data.message, e.data.params);
            break;
        case "AddError" :
            addError(e.data.message, e.data.params);
            break;
        case "AddWarn" :
            addWarn(e.data.message, e.data.params);
            break;
    }
    
})