import { Directive } from '@angular/core';

@Directive()
export abstract class FocusList {

    public abstract listType: string;

}
