import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, search: string): any {
    if (!search || !value) return value;

    const pattern = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regex
    const regex = new RegExp(`(${pattern})`, 'gi');

    return value.replace(regex, '<span class="highlight">$1</span>');
  }
}
