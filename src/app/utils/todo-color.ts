

export class TodoColor{


    // COLOR
    
    public static typeColor(type : string) {
        switch (type) {
  
          case "default":
            return "var(--ion-color-tertiary)";
            
          case "personnal":
            return "var(--ion-color-danger)";
            
          case "project":
            return "var(--ion-color-warning)";
            
          case "work":
            return "var(--ion-color-success)";
            
          default:
            return "var(--ion-color-primary)";
        }
      }
  
  
     public static getCorrectTextColor(hex: string): string {
        const threshold = 130;
        const hRed = hexToR(hex);
        const hGreen = hexToG(hex);
        const hBlue = hexToB(hex);
    
        function hexToR(h: string) {
          return parseInt(cutHex(h).substring(0, 2), 16);
        }
    
        function hexToG(h: string) {
          return parseInt(cutHex(h).substring(2, 4), 16);
        }
    
        function hexToB(h: string) {
          return parseInt(cutHex(h).substring(4, 6), 16);
        }
    
        function cutHex(h: string) {
          return h.charAt(0) === '#' ? h.substring(1, 7) : h;
        }
    
        const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
        if (cBrightness > threshold) {
          return '#000000';
        } else {
          return '#ffffff';
        }
      }
}