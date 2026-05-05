import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { clientes, vehiculos } from "@/db/schema";
import Papa from "papaparse";

interface ClienteRow {
  nombre: string;
  telefono?: string;
  email?: string;
  nif?: string;
  direccion?: string;
}

interface VehiculoRow {
  matricula: string;
  marca?: string;
  modelo?: string;
  anio?: string;
  km?: string;
  combustible?: string;
  color?: string;
  fecha_itv?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
}

export async function POST(request: Request) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const tipo = formData.get("tipo") as string; // "clientes" o "vehiculos"

    if (!file) {
      return NextResponse.json({ error: "No se ha enviado archivo" }, { status: 400 });
    }

    const text = await file.text();
    const { data, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    });

    if (errors.length > 0) {
      return NextResponse.json({ error: "Error al leer el CSV", details: errors.slice(0, 5) }, { status: 400 });
    }

    const rows = data as Record<string, string>[];
    let importados = 0;
    let errores = 0;
    const mensajes: string[] = [];

    if (tipo === "clientes") {
      for (const row of rows) {
        const nombre = row.nombre || row.name || row.cliente || row.razonsocial || row.razon_social;
        if (!nombre || nombre.trim().length < 2) {
          errores++;
          continue;
        }

        try {
          await db.insert(clientes).values({
            tallerId,
            nombre: nombre.trim(),
            telefono: (row.telefono || row.phone || row.tlf || row.tel || row.movil || "").trim() || null,
            email: (row.email || row.correo || row.mail || "").trim() || null,
            nif: (row.nif || row.cif || row.dni || "").trim() || null,
            direccion: (row.direccion || row.address || row.domicilio || "").trim() || null,
          });
          importados++;
        } catch {
          errores++;
        }
      }
    } else if (tipo === "vehiculos") {
      for (const row of rows) {
        const matricula = row.matricula || row.plate || row.registration || row.placa;
        if (!matricula || matricula.trim().length < 4) {
          errores++;
          continue;
        }

        // Buscar o crear cliente
        let clienteId: string | null = null;
        const clienteNombre = row.cliente_nombre || row.cliente || row.propietario || row.owner;
        const clienteTelefono = row.cliente_telefono || row.telefono_cliente;

        if (clienteNombre) {
          // Buscar cliente existente
          const existente = await db.query.clientes.findFirst({
            where: (c, { and, eq, ilike }) =>
              and(eq(c.tallerId, tallerId), ilike(c.nombre, clienteNombre.trim())),
          });

          if (existente) {
            clienteId = existente.id;
          } else {
            // Crear cliente
            const [nuevo] = await db.insert(clientes).values({
              tallerId,
              nombre: clienteNombre.trim(),
              telefono: clienteTelefono?.trim() || null,
            }).returning();
            clienteId = nuevo.id;
          }
        }

        if (!clienteId) {
          errores++;
          mensajes.push(`Vehículo ${matricula}: sin cliente asociado`);
          continue;
        }

        try {
          await db.insert(vehiculos).values({
            tallerId,
            clienteId,
            matricula: matricula.trim().toUpperCase(),
            marca: (row.marca || row.make || row.brand || "").trim() || null,
            modelo: (row.modelo || row.model || "").trim() || null,
            anio: row.anio || row.año || row.year ? parseInt(row.anio || row.año || row.year) : null,
            km: row.km || row.kilometros || row.kms ? parseInt(row.km || row.kilometros || row.kms) : null,
            combustible: (row.combustible || row.fuel || "").trim().toLowerCase() as any || null,
            color: (row.color || "").trim() || null,
            fechaItv: (row.fecha_itv || row.itv || "").trim() || null,
          });
          importados++;
        } catch {
          errores++;
        }
      }
    } else {
      return NextResponse.json({ error: "Tipo no válido. Usa 'clientes' o 'vehiculos'" }, { status: 400 });
    }

    return NextResponse.json({
      message: `Importación completada`,
      importados,
      errores,
      total: rows.length,
      mensajes: mensajes.slice(0, 10),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
