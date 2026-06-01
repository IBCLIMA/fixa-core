import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";

export default function DpaPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center gap-2">
          <Link href="/"><FixaLogo size="sm" /></Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 prose prose-stone">
        <h1>Contrato de Encargado del Tratamiento de Datos (DPA)</h1>
        <p><strong>Ultima actualizacion:</strong> Mayo 2026</p>
        <p>Conforme al Articulo 28 del Reglamento (UE) 2016/679 (RGPD)</p>

        <hr />

        <h2>1. Partes</h2>
        <p><strong>Responsable del tratamiento (en adelante, el "Responsable"):</strong> El taller mecanico que contrata los servicios de FIXA.</p>
        <p><strong>Encargado del tratamiento (en adelante, el "Encargado"):</strong> FIXA, producto de Ibanez Clima, con domicilio en Espana.</p>

        <h2>2. Objeto del contrato</h2>
        <p>El presente contrato regula el tratamiento de datos personales que el Encargado realiza por cuenta del Responsable a traves de la plataforma FIXA de gestion de taller mecanico.</p>

        <h2>3. Finalidad del tratamiento</h2>
        <p>El Encargado tratara los datos personales unicamente para las siguientes finalidades:</p>
        <ul>
          <li>Gestion de clientes del taller (alta, consulta, modificacion)</li>
          <li>Gestion de vehiculos y su historial de reparaciones</li>
          <li>Creacion y gestion de ordenes de trabajo</li>
          <li>Elaboracion y envio de presupuestos</li>
          <li>Gestion de citas y avisos de mantenimiento</li>
          <li>Almacenamiento de fotografias de vehiculos</li>
          <li>Generacion de informes y estadisticas para el taller</li>
        </ul>

        <h2>4. Categorias de datos tratados</h2>
        <table>
          <thead>
            <tr><th>Categoria</th><th>Datos</th><th>Interesados</th></tr>
          </thead>
          <tbody>
            <tr><td>Datos identificativos</td><td>Nombre, NIF, direccion, telefono, email</td><td>Clientes del taller</td></tr>
            <tr><td>Datos de vehiculos</td><td>Matricula, marca, modelo, VIN, kilometraje</td><td>Clientes del taller</td></tr>
            <tr><td>Datos de reparaciones</td><td>Diagnosticos, presupuestos, ordenes de trabajo</td><td>Clientes del taller</td></tr>
            <tr><td>Imagenes</td><td>Fotografias de vehiculos (entrada, proceso, salida)</td><td>Clientes del taller</td></tr>
            <tr><td>Datos del taller</td><td>Nombre, CIF, direccion, telefono, email</td><td>Personal del taller</td></tr>
          </tbody>
        </table>

        <h2>5. Obligaciones del Encargado</h2>
        <p>El Encargado se compromete a:</p>
        <ol>
          <li><strong>Tratar los datos unicamente segun las instrucciones documentadas del Responsable</strong>, salvo que este obligado a ello en virtud del Derecho de la Union o de los Estados miembros.</li>
          <li><strong>Garantizar la confidencialidad</strong> de las personas autorizadas para tratar los datos personales.</li>
          <li><strong>Implementar medidas tecnicas y organizativas apropiadas</strong> para garantizar un nivel de seguridad adecuado al riesgo (Art. 32 RGPD).</li>
          <li><strong>No subcontratar</strong> sin autorizacion previa por escrito del Responsable, salvo los subencargados listados en la seccion 8.</li>
          <li><strong>Asistir al Responsable</strong> en el cumplimiento de su obligacion de atender los derechos de los interesados (acceso, rectificacion, supresion, portabilidad, limitacion, oposicion).</li>
          <li><strong>Notificar las violaciones de seguridad</strong> sin dilacion indebida y, a mas tardar, en 48 horas desde su conocimiento.</li>
          <li><strong>Suprimir o devolver los datos personales</strong> al finalizar la prestacion del servicio, salvo que exista obligacion legal de conservacion.</li>
          <li><strong>Poner a disposicion del Responsable</strong> toda la informacion necesaria para demostrar el cumplimiento de las obligaciones del Art. 28 RGPD.</li>
        </ol>

        <h2>6. Medidas de seguridad</h2>
        <p>El Encargado implementa las siguientes medidas:</p>
        <ul>
          <li><strong>Cifrado en transito:</strong> Todas las comunicaciones utilizan TLS 1.2+ (HTTPS)</li>
          <li><strong>Cifrado en reposo:</strong> Base de datos cifrada con AES-256</li>
          <li><strong>Control de acceso:</strong> Autenticacion multifactor via Clerk, aislamiento por taller (multi-tenant)</li>
          <li><strong>Copias de seguridad:</strong> Backups automaticos diarios con retencion de 7 dias</li>
          <li><strong>Monitorizacion:</strong> Logs de acceso y auditorias de seguridad</li>
          <li><strong>Aislamiento de datos:</strong> Cada taller solo puede acceder a sus propios datos (tenant isolation)</li>
          <li><strong>Principio de minimo privilegio:</strong> Sistema de roles (admin, mecanico, recepcion)</li>
        </ul>

        <h2>7. Derechos de los interesados</h2>
        <p>FIXA proporciona herramientas al Responsable para facilitar el ejercicio de los derechos RGPD:</p>
        <ul>
          <li><strong>Derecho de acceso (Art. 15):</strong> Generacion automatica de informes con todos los datos del cliente</li>
          <li><strong>Derecho de rectificacion (Art. 16):</strong> Edicion de datos del cliente desde el panel</li>
          <li><strong>Derecho de supresion (Art. 17):</strong> Anonimizacion de datos personales preservando la integridad fiscal</li>
          <li><strong>Derecho a la portabilidad (Art. 20):</strong> Exportacion de datos en formato JSON estructurado</li>
        </ul>

        <h2>8. Subencargados del tratamiento</h2>
        <p>El Responsable autoriza al Encargado a subcontratar los siguientes servicios:</p>
        <table>
          <thead>
            <tr><th>Subencargado</th><th>Servicio</th><th>Ubicacion</th><th>Garantias</th></tr>
          </thead>
          <tbody>
            <tr><td>Neon Inc.</td><td>Base de datos PostgreSQL</td><td>EE.UU.</td><td>Clausulas contractuales tipo (SCCs)</td></tr>
            <tr><td>Vercel Inc.</td><td>Hosting, Blob Storage</td><td>EE.UU. / UE</td><td>Clausulas contractuales tipo (SCCs)</td></tr>
            <tr><td>Clerk Inc.</td><td>Autenticacion de usuarios</td><td>EE.UU.</td><td>Clausulas contractuales tipo (SCCs)</td></tr>
          </tbody>
        </table>

        <h2>9. Transferencias internacionales</h2>
        <p>Algunos subencargados tienen servidores fuera del Espacio Economico Europeo (EEE). Estas transferencias se realizan al amparo de:</p>
        <ul>
          <li>Clausulas contractuales tipo aprobadas por la Comision Europea (Decision 2021/914)</li>
          <li>Marco de Privacidad de Datos UE-EE.UU. (EU-US Data Privacy Framework), cuando aplique</li>
        </ul>

        <h2>10. Periodo de conservacion</h2>
        <ul>
          <li><strong>Datos de clientes activos:</strong> Mientras dure la relacion comercial con el taller</li>
          <li><strong>Datos tras baja del taller:</strong> 30 dias para recuperacion, despues supresion</li>
          <li><strong>Datos con obligacion fiscal:</strong> 4 anios tras la ultima factura (Ley General Tributaria)</li>
          <li><strong>Copias de seguridad:</strong> 7 dias</li>
        </ul>

        <h2>11. Obligaciones del Responsable</h2>
        <p>El Responsable se compromete a:</p>
        <ol>
          <li>Haber obtenido el consentimiento o disponer de base juridica para el tratamiento de los datos que introduce en FIXA.</li>
          <li>Informar a sus clientes sobre el tratamiento de datos conforme a los Arts. 13 y 14 RGPD.</li>
          <li>Atender los derechos de los interesados utilizando las herramientas proporcionadas por FIXA.</li>
          <li>No introducir datos de categorias especiales (Art. 9 RGPD) en la plataforma.</li>
        </ol>

        <h2>12. Duracion y resolucion</h2>
        <p>Este contrato tiene la misma duracion que la suscripcion del Responsable a FIXA. A la finalizacion:</p>
        <ul>
          <li>El Encargado pondra a disposicion del Responsable una exportacion completa de sus datos.</li>
          <li>Transcurridos 30 dias, los datos seran eliminados de forma segura, salvo obligacion legal de conservacion.</li>
        </ul>

        <h2>13. Legislacion aplicable</h2>
        <p>Este contrato se rige por la legislacion espanola y, en particular, por:</p>
        <ul>
          <li>Reglamento (UE) 2016/679 (RGPD)</li>
          <li>Ley Organica 3/2018, de 5 de diciembre (LOPDGDD)</li>
        </ul>

        <hr />

        <p className="text-sm text-stone-500 mt-8">
          Al aceptar este contrato durante el registro en FIXA, el Responsable confirma haber leido, entendido y aceptado las condiciones aqui establecidas.
        </p>

        <div className="mt-12 pt-6 border-t text-sm text-stone-400">
          <p>FIXA - Gestion de Taller | Producto de Ibanez Clima</p>
          <p>Contacto DPO: privacidad@fixaapp.es</p>
        </div>
      </main>
    </div>
  );
}
