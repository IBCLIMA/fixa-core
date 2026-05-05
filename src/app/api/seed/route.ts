import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { clientes, vehiculos, ordenesTrabajo, lineasOrden, citas, historialEstados } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function POST() {
  try {
    // Solo permitir en desarrollo o con header especial
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev) {
      return NextResponse.json({ error: "Seed solo disponible en desarrollo" }, { status: 403 });
    }

    const { tallerId, usuarioId } = await getTallerIdFromAuth();
    const db = getDb();

    // Verificar si ya hay datos
    const [existing] = await db.select({ count: count() }).from(clientes).where(eq(clientes.tallerId, tallerId));
    if ((existing?.count ?? 0) > 3) {
      return NextResponse.json({ message: "Ya hay datos en este taller", count: existing?.count });
    }

    // Clientes
    const clientesData = [
      { nombre: "Antonio García López", telefono: "612345678", email: "antonio.garcia@email.com", nif: "12345678A" },
      { nombre: "María López Fernández", telefono: "623456789", email: "maria.lopez@email.com" },
      { nombre: "Pedro Martínez Ruiz", telefono: "634567890", email: "pedro.martinez@email.com", nif: "87654321B" },
      { nombre: "Laura Sánchez Gil", telefono: "645678901" },
      { nombre: "Carlos Ruiz Moreno", telefono: "656789012", email: "carlos.ruiz@email.com" },
      { nombre: "Ana Fernández Torres", telefono: "667890123" },
      { nombre: "Jorge Navarro Díaz", telefono: "678901234", nif: "11223344C" },
      { nombre: "Isabel Romero Vega", telefono: "689012345" },
      { nombre: "David Jiménez Soto", telefono: "690123456", email: "david.jimenez@email.com" },
      { nombre: "Carmen Herrera Luna", telefono: "601234567" },
      { nombre: "Manuel Ortiz Blanco", telefono: "612098765", nif: "55667788D" },
      { nombre: "Rosa Delgado Paz", telefono: "623098765" },
    ];

    const createdClientes = [];
    for (const c of clientesData) {
      const [cliente] = await db.insert(clientes).values({ ...c, tallerId }).returning();
      createdClientes.push(cliente);
    }

    // Vehículos
    const vehiculosData = [
      { clienteIdx: 0, matricula: "4532 HBK", marca: "Seat", modelo: "León", anio: 2019, km: 87500, combustible: "gasolina" as const, color: "Negro", fechaItv: "2026-06-15" },
      { clienteIdx: 1, matricula: "7891 JNM", marca: "Renault", modelo: "Clio", anio: 2020, km: 52000, combustible: "diesel" as const, color: "Blanco" },
      { clienteIdx: 2, matricula: "2345 FGT", marca: "Volkswagen", modelo: "Golf", anio: 2018, km: 120000, combustible: "diesel" as const, color: "Gris", fechaItv: "2026-05-20" },
      { clienteIdx: 3, matricula: "8901 KLP", marca: "Ford", modelo: "Focus", anio: 2021, km: 35000, combustible: "gasolina" as const },
      { clienteIdx: 4, matricula: "3456 BMN", marca: "Toyota", modelo: "Yaris", anio: 2017, km: 95000, combustible: "hibrido" as const, color: "Rojo" },
      { clienteIdx: 5, matricula: "5678 DRS", marca: "Peugeot", modelo: "308", anio: 2019, km: 78000, combustible: "diesel" as const, fechaItv: "2026-05-10" },
      { clienteIdx: 6, matricula: "9012 FVW", marca: "Opel", modelo: "Corsa", anio: 2022, km: 22000, combustible: "gasolina" as const },
      { clienteIdx: 7, matricula: "1234 GHJ", marca: "Citroën", modelo: "C3", anio: 2016, km: 145000, combustible: "diesel" as const, color: "Azul" },
      { clienteIdx: 8, matricula: "6789 KMN", marca: "BMW", modelo: "Serie 3", anio: 2020, km: 65000, combustible: "gasolina" as const, color: "Blanco" },
      { clienteIdx: 9, matricula: "0123 PQR", marca: "Mercedes", modelo: "Clase A", anio: 2021, km: 28000, combustible: "gasolina" as const },
      { clienteIdx: 0, matricula: "4567 STU", marca: "Seat", modelo: "Ibiza", anio: 2015, km: 160000, combustible: "gasolina" as const, color: "Rojo" },
      { clienteIdx: 10, matricula: "8901 VWX", marca: "Dacia", modelo: "Sandero", anio: 2023, km: 12000, combustible: "glp" as const },
      { clienteIdx: 11, matricula: "2345 YZA", marca: "Fiat", modelo: "500", anio: 2018, km: 68000, combustible: "gasolina" as const, color: "Amarillo" },
    ];

    const createdVehiculos = [];
    for (const v of vehiculosData) {
      const [vehiculo] = await db.insert(vehiculos).values({
        clienteId: createdClientes[v.clienteIdx].id,
        tallerId,
        matricula: v.matricula,
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio,
        km: v.km,
        combustible: v.combustible,
        color: v.color,
        fechaItv: v.fechaItv,
      }).returning();
      createdVehiculos.push(vehiculo);
    }

    // Órdenes de trabajo
    const ordenesData = [
      { vehiculoIdx: 0, clienteIdx: 0, estado: "en_reparacion" as const, desc: "Ruido al frenar, revisar pastillas y discos", km: 87500 },
      { vehiculoIdx: 2, clienteIdx: 2, estado: "diagnostico" as const, desc: "Ruido en suspensión delantera", km: 120300 },
      { vehiculoIdx: 5, clienteIdx: 5, estado: "listo" as const, desc: "Cambio aceite y filtros", km: 78200 },
      { vehiculoIdx: 7, clienteIdx: 7, estado: "esperando_recambio" as const, desc: "Avería en turbo, pierde presión", km: 145500 },
      { vehiculoIdx: 8, clienteIdx: 8, estado: "recibido" as const, desc: "Revisión general + ITV", km: 65100 },
      { vehiculoIdx: 1, clienteIdx: 1, estado: "presupuestado" as const, desc: "Fallo en embrague", km: 52300 },
      { vehiculoIdx: 4, clienteIdx: 4, estado: "entregado" as const, desc: "Cambio de batería", km: 95000 },
      { vehiculoIdx: 3, clienteIdx: 3, estado: "entregado" as const, desc: "Alineado y equilibrado", km: 35200 },
    ];

    for (let i = 0; i < ordenesData.length; i++) {
      const o = ordenesData[i];
      const [orden] = await db.insert(ordenesTrabajo).values({
        tallerId,
        vehiculoId: createdVehiculos[o.vehiculoIdx].id,
        clienteId: createdClientes[o.clienteIdx].id,
        numero: i + 1,
        estado: o.estado,
        kmEntrada: o.km,
        descripcionCliente: o.desc,
        fechaEntrega: o.estado === "entregado" ? new Date() : undefined,
      }).returning();

      // Líneas de trabajo para algunas órdenes
      if (i === 0) { // Frenos
        await db.insert(lineasOrden).values([
          { ordenId: orden.id, tipo: "recambio" as const, descripcion: "Pastillas de freno delanteras", cantidad: "1", precioUnitario: "45.00", ivaPct: "21" },
          { ordenId: orden.id, tipo: "recambio" as const, descripcion: "Discos de freno delanteros (par)", cantidad: "1", precioUnitario: "120.00", ivaPct: "21" },
          { ordenId: orden.id, tipo: "mano_obra" as const, descripcion: "Sustitución frenos delanteros", cantidad: "2", precioUnitario: "45.00", ivaPct: "21" },
        ]);
      }
      if (i === 2) { // Aceite
        await db.insert(lineasOrden).values([
          { ordenId: orden.id, tipo: "recambio" as const, descripcion: "Aceite 5W30 5L", cantidad: "1", precioUnitario: "38.00", ivaPct: "21" },
          { ordenId: orden.id, tipo: "recambio" as const, descripcion: "Filtro de aceite", cantidad: "1", precioUnitario: "12.00", ivaPct: "21" },
          { ordenId: orden.id, tipo: "recambio" as const, descripcion: "Filtro de aire", cantidad: "1", precioUnitario: "15.00", ivaPct: "21" },
          { ordenId: orden.id, tipo: "mano_obra" as const, descripcion: "Cambio aceite y filtros", cantidad: "1", precioUnitario: "35.00", ivaPct: "21" },
        ]);
      }
      if (i === 6) { // Batería entregada
        await db.insert(lineasOrden).values([
          { ordenId: orden.id, tipo: "recambio" as const, descripcion: "Batería 70Ah", cantidad: "1", precioUnitario: "95.00", ivaPct: "21" },
          { ordenId: orden.id, tipo: "mano_obra" as const, descripcion: "Sustitución batería", cantidad: "0.5", precioUnitario: "45.00", ivaPct: "21" },
        ]);
      }

      // Historial
      await db.insert(historialEstados).values({ ordenId: orden.id, estadoNuevo: "recibido", usuarioId });
      if (o.estado !== "recibido") {
        await db.insert(historialEstados).values({ ordenId: orden.id, estadoAnterior: "recibido", estadoNuevo: o.estado, usuarioId });
      }
    }

    // Citas de hoy
    const hoy = new Date().toISOString().split("T")[0];
    const citasData = [
      { nombre: "Pedro Martínez", telefono: "634567890", hora: "09:30", motivo: "Revisión suspensión" },
      { nombre: "Laura Sánchez", telefono: "645678901", hora: "11:00", motivo: "Cambio neumáticos" },
      { nombre: "Carlos Ruiz", telefono: "656789012", hora: "16:30", motivo: "Ruido motor" },
    ];

    for (const c of citasData) {
      await db.insert(citas).values({
        tallerId,
        nombreCliente: c.nombre,
        telefonoCliente: c.telefono,
        fecha: hoy,
        horaInicio: c.hora,
        motivo: c.motivo,
      });
    }

    return NextResponse.json({
      message: "Datos de demo creados",
      clientes: createdClientes.length,
      vehiculos: createdVehiculos.length,
      ordenes: ordenesData.length,
      citas: citasData.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
