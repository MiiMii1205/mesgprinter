export class Tools {
    
    public static readonly THRESHOLD = 0.43;
    
    public static getContrastingColor<T>(colorArray: ColorArray, light: T, dark: T): T {
        let [r, g, b]: ColorArray = colorArray;
        let luma: number;
        
        r /= 255;
        b /= 255;
        g /= 255;
        
        r = ((r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4));
        g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
        b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);
        
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        
        return luma < Tools.THRESHOLD ? light : dark;
    }
    
    public static rgbToHex(r: number, g: number, b: number): string {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    public static parseToHTML(s: string): Element {
        let tmp: Document = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = s;
        return tmp.body.children[0];
    }
}