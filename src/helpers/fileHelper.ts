import * as XLSX from "xlsx";

export class FileHelper {
  public static readCsv(result:any): any {
    const arrayBuffer:ArrayBuffer = result;
    const workbook = XLSX.read(arrayBuffer, { type: 'array', codepage: 65001 });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const res:any = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    res[0] = res[0].map((item:any) => this.textConvert(item));
    return {
      columns: res[0],
      items: this.convertToObjects(res)
    }
  }


  public static convertToObjects(data: any[][]): any[] {
    const columns = data[0];
    const result = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const obj: any = {};

      for (let j = 0; j < columns.length; j++) {
        obj[columns[j]] = row[j];
      }

      result.push(obj);
    }

    return result;
  }

  public static exportToCsv(data: any[], fileName: string) {
    const csvContent = this.convertArrayToCsv(data);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodedUri);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  public static downloadCsvFile(filePath:string) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'downloaded-file.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static convertArrayToCsv(data: any[]): string {
    const csvRows = [];

    // Obtener las claves (encabezados) del primer objeto del array
    const headers = Object.keys(data[0]);

    // Agregar encabezados al archivo CSV
    csvRows.push(headers.join(','));

    // Agregar cada fila de datos al archivo CSV
    data.forEach(item => {
      const values = headers.map(header => this.escapeCsvValue(item[header]));
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  private static textConvert(text: string): string {
    const item = text.split(" ");

    for (let i = 0; i < item.length; i++) {
      item[i] = item[i][0].toLowerCase() + item[i].slice(1).toLowerCase();
    }

    return item.join("_");
  }

  private static escapeCsvValue(value: any): string {
    if (typeof value === 'string') {
      // Escapar comas y comillas dobles
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
