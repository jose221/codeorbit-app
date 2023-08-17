export function groupBy(array:any, property:any){
  return array.reduce((result:any, obj:any) => {
    const key = obj[property];
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(obj);
    return result;
  }, {});
}

export class Query {
  private data: any[];
  private filters: { key: any, value: string, type:string }[];

  constructor(data: any[]) {
    this.data = data;
    this.filters = [];
  }

  get(): any {
    let items:any[] = this.data;
    //like in
    //like
    for (const { key, value, type } of this.filters) {
      items = this.filterLike(items, { key, value });

    }
    return items;
  }
  private filterLike(items: any[], filter: { key: any[], value: string }): any {
    const filteredData: any[] = [];
    for (const item of items) {
      //like
      for(const k of filter.key){
        if ((k in item) && this.likeInFilterIgnoreAccentsAndCase(item[k], filter.value)) {
          filteredData.push(item);
          break;
        }
      }
    }
    return filteredData;
  }

  private likeCondition(value: string | any[keyof any], pattern: string): boolean {
    if (typeof value === 'string') {
      const normalizedValue = this.removeAccents(value.toLowerCase());
      const normalizedPattern = this.removeAccents(pattern.toLowerCase());
      return normalizedValue.includes(normalizedPattern);
    }
    return false;
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  public like(keys:any[] | string ='', value: any): Query {
    if(value){
      if (typeof keys === 'string') {
        keys = [keys];
      }
      this.filters.push({ key: keys, value, type:'like' });
    }
    //this.filters = keys.map(key => ({ key, value, type:'likeOr' }));
    return this;
  }

  likeInFilterIgnoreAccentsAndCase(value:any, pattern: any) {
    const normalizedValue = this.removeAccents(value.toLowerCase());
    const normalizedPattern = this.removeAccents(pattern.toLowerCase());
    const regexPattern = normalizedPattern
      .replace(/%/g, '.*')
      .replace(/_/g, '.');
    const regex = new RegExp(regexPattern, 'i');
    return regex.test(normalizedValue);
  }
}

export function deepCopy<T>(obj: T, visited = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (visited.has(obj)) {
    return visited.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj) as any;
  }

  if (Array.isArray(obj)) {
    const copyArr: any[] = [];
    visited.set(obj, copyArr);
    for (let i = 0; i < obj.length; i++) {
      copyArr[i] = deepCopy(obj[i], visited);
    }
    return copyArr as any;
  }

  if (obj instanceof Object) {
    const copyObj = {} as T;
    visited.set(obj, copyObj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copyObj[key] = deepCopy(obj[key], visited);
      }
    }
    return copyObj;
  }

  throw new Error("Unable to copy object");
}
