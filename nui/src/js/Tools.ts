export const tools = {
    
    // eslint-disable-next-line @typescript-eslint/naming-convention
    THRESHOLD : 0.43,
    
    getContrastingColor<T>(colorArray: ColorArray, light: T, dark: T): T {
        let [r, g, b]: ColorArray = colorArray;
        
        r /= 255;
        b /= 255;
        g /= 255;
        
        r = ((r <= 0.03928) ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4);
        g = (g <= 0.03928) ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
        b = (b <= 0.03928) ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
        
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) < tools.THRESHOLD ? light : dark;
    },
    rgbToHex(r: number, g: number, b: number): string {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    parseToHTML(s: string): Element {
        const tmp: Document = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = s;
        return tmp.body.children[0];
    }
};