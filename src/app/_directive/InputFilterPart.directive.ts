import {
    Directive,
    HostListener,
    ElementRef,
    Input,
    } from "@angular/core";
    
    @Directive({
    selector: "[InputFilterPartDirective]"
    })
    export class InputFilterPartDirective {
        @Input()
        public pattern : string;
        
        constructor( private el: ElementRef) {
         }
    
        @HostListener("input", ["$event"]) 
        @HostListener('keydown', ['$event'])
        @HostListener('keyup', ['$event'])  
        @HostListener('mousedown', ['$event'])  
        @HostListener('mouseup', ['$event'])  
        @HostListener('select', ['$event'])  
        @HostListener('contextmenu', ['$event'])  
        @HostListener('drop', ['$event'])  
        public onEvent(e: any) {
        
            let regex = new RegExp(this.pattern);
            if(this.el.nativeElement.value == ""){
                this.el.nativeElement.oldValue = "";
            }
            else if (regex.test(this.el.nativeElement.value)) {
                this.el.nativeElement.oldValue = this.el.nativeElement.value;
                this.el.nativeElement.oldSelectionStart = this.el.nativeElement.selectionStart;
                this.el.nativeElement.oldSelectionEnd = this.el.nativeElement.selectionEnd;
    
            } else if (this.el.nativeElement.hasOwnProperty("oldValue")) {
                this.el.nativeElement.value = this.el.nativeElement.oldValue < 10 ? "" : this.el.nativeElement.oldValue;
                this.el.nativeElement.setSelectionRange(this.el.nativeElement.oldSelectionStart, this.el.nativeElement.oldSelectionEnd, 'none');
            } else {
                this.el.nativeElement.value = "";
            }   
        }
        ngOnDestroy() {}
    
        
    }
    
    
    
    