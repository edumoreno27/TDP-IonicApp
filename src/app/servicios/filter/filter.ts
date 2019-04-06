import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'matchOrder'
})
export class MatchesOrderPipe implements PipeTransform {
    transform(items: Array<any>, order: number): Array<any> {
        return items.filter(item => item.order === order);
    }
}