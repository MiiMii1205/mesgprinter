--[[
  * Created by MiiMii1205
  * license MIT
--]]

-- Constants --
HOLD_TIME = 5000; -- In ms --
STARTUP_STRING = ('%s v%s initialized'):format(GetCurrentResourceName(), GetResourceMetadata(GetCurrentResourceName(), 'version', 0))
STARTUP_HTML_STRING = (':page_with_curl: **%s** <small>v%s</small> initialized'):format(GetCurrentResourceName(), GetResourceMetadata(GetCurrentResourceName(), 'version', 0))

-- Variables --
local cachedColorNames = {}

---sum
---@param nbs table
---@return number
function sum(nbs)
    local acc = 0;

    for _, v in ipairs(nbs) do
        acc = acc + v;
    end

    return acc;
end
---sum
---@param nbs table
---@return number
function avg(nbs) return sum(nbs) / #nbs end

function lerp(a, b, t) return a + (b - a) * t end

function cubic(a, b, t)
    local tval = -1 + (4 - 2 * t) * t;
    if (t < .5) then
        tval = 2 * t * t;
    end
    return lerp(a, b, tval);
end

function rgbHexToHsl(r255, g255, b255)
    return rgb2hsl(r255 / 255, g255 / 255, b255 / 255);
end

function EvaluateColor(colorToEvaluate, color1, color2)
    local colMax, colMin = color2, color1;
    local evalHue, colSat, colLightness = rgbHexToHsl(table.unpack(colorToEvaluate));

    local colMaxHue, colMaxSat, colMaxLightness = rgbHexToHsl(table.unpack(colMax));
    local colMinHue, colMinSat, colMinLightness = rgbHexToHsl(table.unpack(colMin));

    if (colMinHue > colMaxHue) then
        colMax, colMin = color1, color2;

        colMaxHue, colMaxSat, colMaxLightness = rgbHexToHsl(table.unpack(colMax));
        colMinHue, colMinSat, colMinLightness = rgbHexToHsl(table.unpack(colMin));
    end

    evalHue = evalHue * 360.0;
    colMaxHue = colMaxHue * 360.0;
    colMinHue = colMinHue * 360.0;

    if (evalHue < colMinHue) then

        local calcHue = (evalHue - colMinHue) % 360;
        local calcMin = 0;
        local calcMax = (colMaxHue - colMinHue) % 360;

        calcHue = (calcHue - calcMax) % 360;
        calcMin = (calcMin - calcMax) % 360;
        calcMax = 0

        colSat = cubic(colMaxSat, colMinSat, (calcHue / calcMin) / 360);
        colLightness = cubic(colMaxLightness, colMinLightness, (calcHue / calcMin) / 360);

    elseif (evalHue > colMaxHue) then

        local calcHue = (evalHue - colMaxHue) % 360;
        local calcMin = (colMinHue - colMaxHue) % 360;

        colSat = cubic(colMaxSat, colMinSat, (calcHue / calcMin) / 360);
        colLightness = cubic(colMaxLightness, colMinLightness, (calcHue / calcMin) / 360);

    else

        local calcHue = (evalHue - colMinHue) % 360;
        local calcMax = (colMaxHue - colMinHue) % 360;

        colSat = cubic(colMinSat, colMaxSat, (calcHue / calcMax) / 360);
        colLightness = cubic(colMinLightness, colMaxLightness, (calcHue / calcMax) / 360);
    end

    return table.pack(hsl2rgb(evalHue / 360, colSat, colLightness));

end

function rgb2hsl(r, g, b)

    local max = math.max(r, g, b)
    local min = math.min(r, g, b)
    local baseHSL = (max + min) / 2;
    local h, s, l = baseHSL, baseHSL, baseHSL;

    if min == max then
        h = 0
        s = 0
    else
        local d = max - min;

        if (l > 0.5) then
            s = d / (2 - max - min);
        else
            s = d / (max + min);
        end

        if max == r then
            local v = 0

            if (g < b) then
                v = 6
            end

            h = (g - b) / d + v
        elseif max == g then
            h = (b - r) / d + 2
        elseif max == b then
            h = (r - g) / d + 4
        end

        h = h / 6

    end

    return h, s, l

end

function hue2rgb(p, q, t)

    local lt = t

    if lt < 0 then
        lt = lt + 1
    end

    if lt > 1 then
        lt = lt - 1
    end

    if lt < (1 / 6) then return p + (q - p) * 6 * lt end

    if lt < (1 / 2) then return q end

    if lt < (2 / 3) then return p + (q - p) * ((2 / 3) - lt) * 6 end

    return p

end

function hsl2rgb(h, s, l)
    local r, g, b;

    if s == 0 then
        r, g, b = 1, 1, 1
    else

        local q = l + s - l * s

        if l < 0.5 then
            q = l * (1 + s)
        end

        local p = 2 * l - q

        r = hue2rgb(p, q, h + (1 / 3));
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - (1 / 3));

    end

    return math.floor(r * 255), math.floor(g * 255), math.floor(b * 255)

end

---StringCharAvg
---@param str string
---@return number
function StringCharAvg(str)

    local arr = {}

    for i = 1, #str do
        table.insert(arr, 33 - string.byte(str, i))
    end

    return avg(arr)

end

function Num2RGB(num)
    return (num & 0xFF0000) >> 16, (num & 0xFF00) >> 8, (num & 0xFF)
end

function CalculateRawColor(hash)
    local r, g, b = Num2RGB(hash)
    local h, s, l = rgb2hsl(r / 255, g / 255, b / 255)
    r, g, b = hsl2rgb(h, math.min(1, s * 6), l)
    return table.pack(r * 255, g * 255, b * 255);
end

function CalculateColor(ressourceName, hash)

    local flooredSubLength = math.floor((#ressourceName) / 3)

    local restSub = string.sub(ressourceName, (flooredSubLength * 3) + 1, -1);

    local hashR, hashG, hashB = table.unpack(CalculateRawColor(hash));

    local rSub = string.sub(ressourceName, 1, flooredSubLength) .. restSub
    local gSub = string.sub(ressourceName, flooredSubLength + 1, (flooredSubLength * 2)) .. restSub
    local bSub = string.sub(ressourceName, (flooredSubLength * 2) + 1, flooredSubLength * 3) .. restSub

    local r = avg(table.pack((StringCharAvg(rSub)), hashR))
    local g = avg(table.pack((StringCharAvg(gSub)), hashG))
    local b = avg(table.pack((StringCharAvg(bSub)), hashB))

    local rgbSum = sum(table.pack(r, g, b));

    local h, _, l = rgb2hsl(r / rgbSum, g / rgbSum, b / rgbSum)
    r, g, b = hsl2rgb(h, 1, l)

    return table.pack(r, g, b);

end

function GetColorFromResourceName(ressourceName)

    local hash = GetHashKey(ressourceName);
    local color = cachedColorNames[hash];

    if color == nil then
        color = EvaluateColor(CalculateColor(string.lower(ressourceName), hash), { 219, 38, 38 }, { 30, 150, 46 })
        cachedColorNames[hash] = color;
    end

    return color;

end

function BuildParamsObject(ressourceName, messageColor, holdTime)

    return {
        ressourceName = ressourceName,
        ressourceColor = messageColor or GetColorFromResourceName(ressourceName),
        holdTime = holdTime or HOLD_TIME
    }

end

AddEventHandler('msgprinter:addMessage', function(message, ressourceName, messageColor, holdTime)

    return SendNUIMessage({
        type = 'AddMessage',
        message = message,
        params = BuildParamsObject(ressourceName, messageColor, holdTime)
    })

end)

AddEventHandler('msgprinter:addError', function(error, ressourceName, messageColor, holdTime)

    return SendNUIMessage({
        type = 'AddError',
        message = error,
        params = BuildParamsObject(ressourceName, messageColor, holdTime)
    })

end)

AddEventHandler('msgprinter:addWarn', function(warn, ressourceName, messageColor, holdTime)

    return SendNUIMessage({
        type = 'AddWarn',
        message = warn,
        params = BuildParamsObject(ressourceName, messageColor, holdTime)
    })

end)

RegisterNUICallback('printerReady', function(data, cb)
    print(STARTUP_STRING);
    TriggerEvent('msgprinter:addMessage', STARTUP_HTML_STRING, GetCurrentResourceName());

    return cb(data)
end)




