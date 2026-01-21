
# Guía: Crear una extensión de Checkout en Shopify

Esta guía explica **paso a paso** cómo crear e instalar una extensión en el checkout de Shopify.

---

## 🚨 Requisitos previos

1. **Plan de Shopify Plus**  
   - Las *Checkout UI Extensions* solo funcionan en **tiendas con Shopify Plus**.  
   - Si estás en plan Basic/Advanced, no aparecerán los bloques de apps en el editor de checkout.

2. **Herramientas instaladas**
   - Node.js 18+
   - NPM 8+
   - Shopify CLI >= 3.84
   - Acceso al **Partner Dashboard**

3. **Tienda de desarrollo** conectada a tu cuenta de partner.

---

## 📦 Creación del proyecto

```bash
# Crear el proyecto base
npx create-app

# Selecciona "Build an extension-only app"

# App name → fe-checkout
# Config file → shopify.app.toml
```

Dentro del proyecto tendrás algo como:

```
fe-checkout/
 ├─ shopify.app.toml
 ├─ extensions/
 │   └─ facturacion-electronica/
 │       ├─ shopify.extension.toml
 │       └─ src/Checkout.tsx
```

---

## ⚙️ Configuración

### `shopify.app.toml`

```toml
client_id = "xxxx"
name = "fe-checkout"
application_url = "https://shopify.dev/apps/default-app-home"
embedded = true

[build]
automatically_update_urls_on_dev = true

[webhooks]
api_version = "2025-07"

[auth]
redirect_urls = [ "https://shopify.dev/apps/default-app-home/api/auth" ]
```

### `shopify.extension.toml`

```toml
api_version = "2025-07"

[[extensions]]
name = "Facturacion Electronica"
handle = "facturacion-electronica"
type = "ui_extension"

[[extensions.targeting]]
module = "./src/Checkout.tsx"
target = "purchase.checkout.block.render"

[extensions.capabilities]
api_access = true
```

---

## 🖥️ Código base de la extensión

Archivo: `extensions/facturacion-electronica/src/Checkout.tsx`

```tsx
import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  useApplyAttributeChange,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const applyAttributeChange = useApplyAttributeChange();

  return (
    <BlockStack padding="tight">
      <Banner title="Facturación Electrónica">
        Completa tus datos para la factura electrónica
      </Banner>
      <Checkbox onChange={onCheckboxChange}>
        Solicitar facturación electrónica
      </Checkbox>
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    await applyAttributeChange({
      key: "facturacion",
      type: "updateAttribute",
      value: isChecked ? "sí" : "no",
    });
  }
}
```

---

## 🚀 Desarrollo local

```bash
cd fe-checkout
npx @shopify/cli@latest app dev --store=tu-tienda.myshopify.com
```

Esto genera una **URL de vista previa** y abre el **editor de checkout**.  
En el panel izquierdo, bajo *Apps*, deberías ver **Facturación Electrónica**.

---

## 📤 Deploy a producción

```bash
npx @shopify/cli@latest app deploy
```

Luego confirma el release:

```bash
? Release a new version of fe-checkout? → Yes
```

---

## 🛠️ Verificación

1. Ve a **Admin → Configuración → Pantalla de pago → Personalizar**.  
2. En el editor de checkout, busca la sección *Apps*.  
3. Arrastra tu bloque **Facturación Electrónica**.  
4. Guarda los cambios.  
5. Abre un checkout de prueba y revisa.

---

## ⚡ Troubleshooting

- **No aparece el bloque** → Verifica que la tienda sea **Shopify Plus**.
- **CLI error `no app with client_id`** → Borra el `shopify.app.toml` viejo y vuelve a hacer `--reset`.
- **Se ve solo en preview** → Asegúrate de correr `app deploy` y publicar la versión desde el dashboard.

---

✅ Con esto ya tienes tu extensión de **Facturación Electrónica** lista en el checkout de Shopify.
