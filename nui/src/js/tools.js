const THRESHOLD = 0.43;

module.exports = {
    getContrastingColor(colorArray, light, dark) {
        let [r, g, b] = colorArray;
        
        r /= 255;
        b /= 255;
        g /= 255;
        
        r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
        g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
        b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);
        
        let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        
        return luma < THRESHOLD ? light : dark;
    },
    
    rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    
}