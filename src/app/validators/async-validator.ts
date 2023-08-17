import { AbstractControl, ValidationErrors } from '@angular/forms';

// Ejemplo de un validador asíncrono
export function asyncValidator(control: AbstractControl): Promise<ValidationErrors | null> {
  // Simulamos una operación asincrónica (puedes realizar llamadas a un servicio, API, etc.)
  return new Promise((resolve) => {
    // Validar la condición asincrónica
    // Por ejemplo, verifica si el valor del control existe en la base de datos
    // Si es válido, resuelve con null; de lo contrario, resuelve con un objeto de error
    if (control.value === 'valor_no_valido') {
      resolve({ asyncError: true });
    } else {
      resolve(null);
    }
  });
}
