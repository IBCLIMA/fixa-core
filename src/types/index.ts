// Tipos principales de Solcraft

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
  nif?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehiculo {
  id: string;
  matricula: string;
  marca: string;
  modelo: string;
  anio?: number;
  km?: number;
  vin?: string;
  color?: string;
  combustible?: "gasolina" | "diesel" | "electrico" | "hibrido" | "glp";
  clienteId: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EstadoOrden =
  | "recibido"
  | "diagnostico"
  | "presupuestado"
  | "aprobado"
  | "en_reparacion"
  | "listo"
  | "entregado"
  | "cancelado";

export interface OrdenReparacion {
  id: string;
  numero: string;
  vehiculoId: string;
  clienteId: string;
  estado: EstadoOrden;
  kmEntrada: number;
  descripcionCliente?: string;
  diagnostico?: string;
  fechaEntrada: Date;
  fechaEstimada?: Date;
  fechaEntrega?: Date;
  lineas: LineaOrden[];
  fotos: string[];
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LineaOrden {
  id: string;
  ordenId: string;
  tipo: "mano_obra" | "pieza" | "otros";
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  iva: number;
}

export interface Presupuesto {
  id: string;
  numero: string;
  ordenId?: string;
  vehiculoId: string;
  clienteId: string;
  estado: "borrador" | "enviado" | "aceptado" | "rechazado" | "expirado";
  lineas: LineaOrden[];
  validezDias: number;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Factura {
  id: string;
  numero: string;
  ordenId?: string;
  presupuestoId?: string;
  clienteId: string;
  estado: "borrador" | "emitida" | "pagada" | "anulada";
  lineas: LineaOrden[];
  baseImponible: number;
  totalIva: number;
  total: number;
  metodoPago?: "efectivo" | "tarjeta" | "transferencia" | "bizum";
  fechaEmision: Date;
  fechaVencimiento?: Date;
  verifactu?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CitaTaller {
  id: string;
  vehiculoId?: string;
  clienteId: string;
  fecha: Date;
  horaInicio: string;
  horaFin?: string;
  descripcion: string;
  estado: "programada" | "confirmada" | "en_curso" | "completada" | "cancelada";
  createdAt: Date;
}

export interface AvisoMantenimiento {
  id: string;
  vehiculoId: string;
  tipo: "itv" | "revision_km" | "aceite" | "neumaticos" | "frenos" | "personalizado";
  descripcion: string;
  fechaAviso: Date;
  kmAviso?: number;
  enviado: boolean;
  createdAt: Date;
}
