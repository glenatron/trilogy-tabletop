import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeValue } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

    constructor(private sanitiser: DomSanitizer) { }

    transform(value: string): SafeHtml {
        return this.sanitiser.bypassSecurityTrustHtml(value);
    }

}
