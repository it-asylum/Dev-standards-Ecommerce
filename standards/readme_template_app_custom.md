# Nombre del Componente VTEX Custom

Este componente fue desarrollado para extender funcionalidades específicas de una tienda VTEX IO. Su propósito es brindar una solución reutilizable, documentada y fácilmente integrable con el Store Framework.

---

## 📌 Información del componente

- **Nombre:** `nombre-del-componente`
- **Vendor:** `nombre-del-vendor`
- **Versión:** `0.0.1`
- **Componente principal:** `NombreComponente`
- **Tipo de comportamiento:** `"show-more"` / `"infinite-scroll"` / otro
- **Builder:** `react 3.x`, `store 0.x` (u otros)

---

## 🧩 Instalación

Para instalar el componente en tu tienda VTEX:

```bash
vtex install vendor.nombre-del-componente
```

---

## 🚀 Uso en bloques

Ejemplo de declaración en `interfaces.json`:

```json
{
  "nombre-del-bloque": {
    "component": "NombreComponente",
    "content": {
      "$ref": "app:vendor.nombre-del-componente#/definitions/NombreComponente"
    }
  }
}
```

Inserta este bloque en el `template` correspondiente (`search.json`, `product.json`, etc).

---

## ⚙️ Props disponibles

| Prop | Tipo | Descripción | Valores permitidos | Default |
|------|------|-------------|---------------------|---------|
| `propEjemplo` | `string` | Breve descripción de lo que hace esta prop | `"opcion1"` / `"opcion2"` | `"opcion1"` |

---

## 🧠 Lógica Interna

Describe brevemente la lógica funcional del componente. Por ejemplo:

- Usa `useSearchPage()` para obtener información del contexto.
- Ejecuta mutaciones con `fetchMore`.
- Internamente usa `useEffect`, `useMemo`, `useState`, etc.
- Explica qué pasa cuando el usuario hace clic/interactúa.

---

## 🎨 CSS Handles

```ts
const CSS_HANDLES = [
  'customHandle1',
  'customHandle2',
  'customHandleActivo',
]
```

Reemplaza esta lista con los handles de tu componente. También puedes extender con estilos personalizados en un archivo `.css`.

---

## 🧪 Requisitos y dependencias

Este componente depende de:

```json
{
  "vtex.store-graphql": "x.x",
  "vtex.search-page-context": "x.x",
  "vtex.css-handles": "x.x"
}
```

Asegúrate de tener estas dependencias declaradas en tu `manifest.json`.

---

## 📸 Ejemplo visual (opcional)

Si aplica, incluye un screenshot del componente:

```md
![Componente en acción](https://ruta/a/captura.png)
```

---

## 🧑‍💻 Autor

Desarrollado por [Tu Nombre o Equipo]  
📧 [tucorreo@dominio.com](mailto:tucorreo@dominio.com)

---

## 📄 Licencia

MIT