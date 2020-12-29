# mesgprinter #

A handy [FiveM][5m] script for printing temporary short client-sided logs built with [Bootstrap][btstrp].

![loggingPic](https://github.com/MiiMii1205/mesgprinter/blob/master/Assets/preview.png?raw=true "mesgprinter in action")

## Setup ##

Just clone this repo to your ressource folder of your [FiveM][5m] server. You might also need to edit your `server.cfg` to auto-load the resource.

## Hook-up ##

To hook up your resource to `mesgprinter`, you'll need to trigger some events:

| Event                     | Effect                    |
|---------------------------|---------------------------|
| `msgprinter:addMessage`   |  Prints a generic message |
| `msgprinter:addWarn`      |  Prints an warning        |
| `msgprinter:addError`     |  Prints an error          |

You can use the scripting platform of your liking as long as it's supported by [FiveM][5m]. However, for demonstration purposes, we'll use [lua](https://www.lua.org) as it's the most supported scripting language.

### Event Parameters ###

Each events expects a couple of parameters

```lua
TriggerEvent(typeOfEvent, messageToPrint, badgeText, badgeColor, holdTime)
```

#### `typeOfEvent` <small>(string)</small> ####

The name of the event to trigger

#### `messageToPrint` <small>(string)</small> ####

The message to print

#### `badgeText` <small>(string)</small> ####

The text to show in the message's badge

#### `badgeColor` <small>(int[])</small> ####

An array where each index corresponds to red, blue and green respectively <small>(optional. by default we generate a color from the badge's name)</small>

#### `holdTime` <small>(float)</small> ####

How long the message stays on screen in milliseconds <small>(optional. by default it's 5 seconds)</small>

If you want to learn more about triggering events, [check out FiveM documentation right here](https://docs.fivem.net/docs/scripting-manual/working-with-events/triggering-events/)!

## Format ##

Aside from typical strings, `mesgprinter` can accept many different types of message. It can also deal with multiline messages as well.

### <abbr title="Hyper Text Markup Language">HTML</abbr> ###

`mesgprinter` can accept any <abbr title="Hyper Text Markup Language">HTML</abbr> tags.

This means full <abbr title="Caascading Style Sheets">CSS</abbr> support as well. You can even use standard [Bootstrap][btstrp] classes as well.

```lua
local messageToPrint = '<h1>My Title</h1> <p>My <span class="text-danger">dangerous</span> text</p>'
```

### [Markdown][mrkdwn] ###

`mesgprinter` also fully support [markdown][mrkdwn] out of the box.

Just type some [markdown][mrkdwn] code and pass it to any events.

This means that any thing form images to code blocs are also supported.

[markdown][mrkdwn] can also support <abbr title="Hyper Text Markup Language">HTML</abbr> out of the box too. So feel free to add any <abbr title="Hyper Text Markup Language">HTML</abbr> tag you want!

```lua
local messageToPrint = [[# My Title #

My **BOLD** text

My <span class="text-danger">dangerous</span> text

## My subtitle ##

- This
- Is
- A
- List

*********************************

![My alternative image text](path/to/my/image "My image title")

]]
```

However, be weary that putting a full-sized images on any player's screen might be "distracting", to say the least...

### Emoji ###

Finally, `mesgprinter` also have full emoji support through Twitter's [Twemoji](https://twemoji.twitter.com).

You can add them directly as Unicode characters or whatever your scripting language can do. For simplicity sakes, you can also use a more traditional discord-like syntax, like `:smiley:` for &#128515;.

```lua
local messageToPrint = 'I\'m pretty :smiley: right now!' 
```

To get a list of valid emoji names, just take a look at `nui/scripts/index.js` starting at line `35` to `1872`. But beware, There's a lot of it!

## Building ##

`mesgprinter` uses some fancy [Browserify](http://browserify.org) setup to build its NUI scripts. In addition, the ressource uses [pug](https://pugjs.org/api/getting-started.html) to generate it's dynamic <abbr title="Hyper Text Markup Language">
HTML</abbr> templates. Finally, The ressource also uses [SCSS](https://sass-lang.com) to generate it's <abbr title="Caascading Style Sheets">CSS</abbr>.

The ressource comes with it's assets already pre-installed, so there's no need to rebuild.

Should you ever need to modify the ressource to your liking, you'll need an operational [NodeJS][ndjs] setup.

Once [NodeJS][ndjs] is installed, simply run these commands within the `nui` directory in any command shell:

```shell
npm install;
npm run full-build;
```

The `package.json` file also comes with two separate scripts for individually build each of the NUI components :

```shell
npm run js-build;
npm run css-build;
```

[mrkdwn]: https://daringfireball.net/projects/markdown/syntax "Markdown Syntax"

[brwsrify]: https://daringfireball.net/projects/markdown/syntax "Markdown Syntax"

[5m]: https://fivem.net "FiveM"

[btstrp]: https://getbootstrap.com "Bootstrap"

[ndjs]: https://nodejs.org/en/ "NodeJS"