# FIXA — Biblia de Producto

> Documento vivo. Si una decisión, una pantalla o una frase de marketing contradice esto,
> está mal. La identidad manda sobre la idea concreta del día.

---

## 1. Qué es FIXA (en una frase)

**FIXA es el asistente que evita que al gerente de un taller se le escape lo importante.**

Cada mañana le dice las pocas cosas que necesitan su atención hoy y qué hacer con cada una; y
mantiene a su cliente informado en tiempo real del estado de su coche.

No es un programa de gestión. No es un ERP. No es una "torre de control" (ese concepto sirve
en el código y en la arquitectura, **nunca como promesa comercial**).

---

## 2. El enemigo: el caos

FIXA no compite contra otro software. Compite contra el **caos diario del taller**, que tiene
nombres concretos:

- presupuestos que se enfrían
- coches parados, bloqueados esperando una pieza
- clientes sin noticias que acaban llamando
- llamadas y "¿está listo mi coche?" todo el día
- revisiones e ITV que se pierden
- el gerente viviendo de memoria, apagando fuegos

Todo el producto y todo el marketing giran contra ese enemigo.

---

## 3. Qué ofrecemos y por qué — los dos WOW

FIXA se construye alrededor de **dos momentos "wow"**, uno por cada lado del mostrador.

### WOW del gerente (interno)
> "Abro FIXA y en dos minutos sé qué necesita mi atención y qué tengo que hacer."

**Por qué:** el taller no se descontrola por falta de trabajo, sino porque todo depende de la
memoria de una persona. FIXA piensa por él: prioriza, avisa, y propone la acción.

### WOW del cliente (externo)
> "Nunca me habían informado tan bien en un taller."

**Por qué:** el cliente no llama porque quiera hablar; llama porque **no sabe qué pasa**. FIXA
le da un seguimiento en tiempo real (tipo Amazon) y elimina esa incertidumbre → menos llamadas,
más confianza, mejor reseña, más recurrencia.

### La IA (una sola, con propósito)
Convierte la jerga del mecánico ("compresor clavado, viruta en circuito") en un mensaje claro
y profesional para el cliente. El humano revisa y envía. Elimina trabajo, profesionaliza el
taller y mejora la experiencia. **No** vendemos "IA"; usamos IA donde quita escritura o mejora
la comunicación.

---

## 4. Qué problemas resolvemos (y su coste)

| Problema | Lo que cuesta hoy | Lo que hace FIXA |
|---|---|---|
| Presupuesto olvidado | Venta perdida | Te avisa antes de que se enfríe |
| Coche parado/bloqueado | Menos rotación, dinero parado | Te dice qué lo bloquea y a quién avisar |
| Cliente sin noticias | Llamada o mala reseña | El cliente se entera solo, en tiempo real |
| Revisión / ITV perdida | Cliente que se va a otro taller | Te dice a quién llamar para recuperarla |
| Coche listo sin avisar | Plaza ocupada | Te lo recuerda para que liberes la plaza |
| Gerente "de memoria" | Todo depende de él, va tarde | FIXA recuerda por él |

---

## 5. Qué NO somos (lo más importante)

- **NO somos un ERP.** Nada de contabilidad, stock completo, almacén (FIFO/PMP, ubicaciones,
  inventarios), nóminas, compras complejas ni BI financiero.
- **NO somos "el programa que lo hace todo".** Hacemos pocas cosas, y que muevan dinero o
  eviten un problema.
- **NO somos un sistema de registro.** No existimos para registrar lo que pasa; existimos para
  que no se escape lo importante.
- **NO somos un chatbot de WhatsApp autónomo.** La IA propone, el humano decide.
- **NO competimos en features** contra Taller Manager, Quiter o GDTaller. Competimos contra el
  caos y contra el cuaderno.
- **NO vendemos "torre de control" ni "software de gestión".** Vendemos *dejar de depender de
  tu memoria* y *dejar de perder dinero y tiempo*.

> **El mayor riesgo de FIXA no es técnico. Es convertirse, función a función, en otro ERP.**
> Cada idea nueva parece razonable. Dos años después nadie sabe qué nos hace diferentes. No lo
> permitimos: cada decisión refuerza la identidad o no entra.

---

## 6. Arquitectura mental (3 capas)

1. **Registro** (clientes, vehículos, órdenes, estados, presupuestos) — necesaria, **no
   diferencial**. Ya está.
2. **Automatización** (avisar, recordar ITV, pedir reseña, enviar enlace) — ahorra tiempo.
3. **Inteligencia / control** ("¿qué hago ahora?") — **la empresa de verdad**. Es una vista
   DERIVADA de la capa 1 (se calcula al vuelo de timestamps), no un módulo que alguien mantiene.

El portal del cliente atraviesa las tres y es el WOW externo.

---

## 7. Para quién (avatar)

El **gerente de un taller pequeño o mediano, moderno o mínimamente digitalizado**: usa
WhatsApp y el ordenador, pide recambios online, quiere profesionalizarse y tener control, y
**no** quiere un ERP pesado. No vendemos al mecánico tecnófobo (no adoptaría nada). Matiz: el
gerente quiere una interfaz **rica y clara**; el operario, **entrada de datos en 2 toques**.
Sencillo no es pobre: sencillo es sin fricción.

---

## 8. El Filtro FIXA (antes de construir cualquier cosa)

1. ¿Refuerza la promesa principal?
2. ¿Da más control al gerente?
3. ¿Mejora la experiencia del cliente?
4. ¿Genera una acción?
5. ¿Crea hábito?
6. ¿Nos acerca peligrosamente a un ERP? *(si sí → alarma)*
7. ¿Resolvemos un problema o solo añadimos una feature?

Si no lo supera con holgura, **no se construye**.

---

## 9. Cómo medimos (comportamiento, no funciones)

No medimos nº de alertas, pantallas o módulos. Medimos:

- acciones que ha provocado FIXA (llamadas, WhatsApps, estados actualizados)
- presupuestos recuperados tras un aviso
- llamadas evitadas (proxy: aperturas del portal por reparación)
- clientes que abren el portal
- **North Star: ¿el gerente abre FIXA antes que el WhatsApp y el correo cada mañana?**

---

## 10. La regla más importante

> **FIXA no existe para registrar lo que pasa en un taller.**
> **FIXA existe para evitar que al gerente se le escape lo importante.**

Si dentro de seis meses seguimos construyendo alrededor de esta frase, tendremos algo muy
difícil de copiar. Si dejamos de hacerlo, seremos otro ERP con más funciones — y ese no es el
camino.
