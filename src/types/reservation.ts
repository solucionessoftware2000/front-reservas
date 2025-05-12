export interface Reservation {
  id?: number;
  fecha: string;
  horario: string;
  origen: string;
  destino: string;
  pasajero: string;
  contacto: string;
  numPasajeros: number;
  valor: number;
  medioPago: string;
  referencia: string;
}