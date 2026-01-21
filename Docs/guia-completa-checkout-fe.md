
# Guía completa: Checkout UI Extension “Facturación Electrónica” en Shopify

Este documento incluye el proceso **desde cero**: creación de la app, extensión, configuración,
validación de NIT con dígito verificador y dataset inicial de DANE.

---

## 🚨 Requisitos previos

1. **Plan Shopify Plus**  
   - Para usar `purchase.checkout.block.render` necesitas Shopify Plus.
   - En planes sin Plus usa `purchase.thank-you.block.render`.

2. **Herramientas**  
   - Node.js 18+  
   - NPM 8+  
   - Shopify CLI 3.84+ (`npx @shopify/cli@latest`)  
   - Cuenta en **Shopify Partners**.

3. **Tienda dev**: `<tu-tienda>.myshopify.com`

---

## 📦 Crear app y vincular

```bash
npx create-app
# Selecciona "Build an extension-only app"
cd fe-checkout

npx -y @shopify/cli@latest app dev --reset --store=<tu-tienda>.myshopify.com
# → login
# → Yes, create it as a new app
```

Archivo generado `shopify.app.toml`:

```toml
client_id = "<CLIENT_ID_VALIDO>"
name = "fe-checkout"
application_url = "https://shopify.dev/apps/default-app-home"
embedded = true

[build]
automatically_update_urls_on_dev = true

[webhooks]
api_version = "2025-07"

[access_scopes]
scopes = ""

[auth]
redirect_urls = ["https://shopify.dev/apps/default-app-home/api/auth"]
```

---

## 🛠 Generar la extensión

```bash
npx -y @shopify/cli@latest app generate extension --template=checkout_ui --name="Facturacion Electronica"
```

En `extensions/facturacion-electronica/shopify.extension.toml`:

```toml
api_version = "2025-07"

[[extensions]]
name = "Facturacion Electronica"
handle = "facturacion-electronica"
type = "ui_extension"

[[extensions.targeting]]
module = "./src/Checkout.tsx"
target = "purchase.checkout.block.render" # requiere Plus
# target = "purchase.thank-you.block.render" # alternativa sin Plus

[extensions.capabilities]
api_access = true
```

---

## 📄 Código `Checkout.tsx`

```tsx
import {
  reactExtension,
  BlockStack,
  InlineLayout,
  Heading,
  TextField,
  Select,
  useAttributes,
  useApplyAttributeChange,
  useBuyerJourneyIntercept,
} from '@shopify/ui-extensions-react/checkout';
import {useState, useMemo, useEffect} from 'react';
import co from './data/co.json';

export default reactExtension("purchase.checkout.block.render", () => <Extension />);

function computeNITCheckDigit(nitBody) {
  const weights = [3,7,13,17,19,23,29,37,41,43,47,53,59,67,71];
  const digits = nitBody.replace(/\D/g,'').split('').map(Number).reverse();
  let sum = 0;
  for (let i=0; i<digits.length; i++) sum += digits[i]*weights[i];
  const dv = sum % 11;
  return dv > 1 ? 11-dv : dv;
}
function isNITValid(nitRaw) {
  const m = nitRaw.match(/^(\d+)-?(\d)$/);
  if (!m) return false;
  return computeNITCheckDigit(m[1]) === Number(m[2]);
}

function Extension() {
  const attrs = useAttributes();
  const apply = useApplyAttributeChange();
  const [nombres,setNombres] = useState("");
  const [numDoc,setNumDoc] = useState("");

  useBuyerJourneyIntercept(({canBlockProgress}) => {
    if ((!nombres || !isNITValid(numDoc)) && canBlockProgress) {
      return {behavior:"block", reason:"Completa datos válidos de facturación"};
    }
  });

  return (
    <BlockStack>
      <Heading>Facturación electrónica</Heading>
      <InlineLayout columns={['1fr','1fr']} spacing="base">
        <TextField label="Nombres" value={nombres} onChange={v=>{setNombres(v);apply({type:"updateAttribute",key:"fe_nombres",value:v});}} />
        <TextField label="NIT" value={numDoc} onChange={v=>{setNumDoc(v);apply({type:"updateAttribute",key:"fe_nit",value:v});}} />
      </InlineLayout>
    </BlockStack>
  );
}
```

---

## 📂 Dataset inicial DANE `data/co.json`

```json
{
  "departamentos":[
    {"label":"Seleccione","value":"--"},
    {"label":"Antioquia","value":"05"},
    {"label":"Atlántico","value":"08"},
    {"label":"Bogotá D.C.","value":"11"}
  ],
  "ciudades":{
    "--":[{"label":"Seleccione","value":""}],
    "05":[{"label":"Medellín","value":"Medellín"}],
    "08":[{"label":"Barranquilla","value":"Barranquilla"}],
    "11":[{"label":"Bogotá","value":"Bogotá"}]
  }
}
```

Ampliar con todos los municipios oficiales de DANE.

---

## 🚀 Desarrollo

```bash
npx -y @shopify/cli@latest app dev --store=<tu-tienda>.myshopify.com
```

Abre el **Checkout Editor → Apps → agregar bloque Facturación Electrónica**.

---

## 📤 Deploy

```bash
npx -y @shopify/cli@latest app deploy
# Yes, release this new version
```

Luego: Admin → Configuración → Pantalla de pago → Personalizar → Apps → agrega bloque.

---

## ✅ Troubleshooting

- No aparece en checkout → revisa que la tienda sea **Plus**.
- Solo en preview → falta `app deploy` y publicar en editor de checkout.
- Error `get is not a function` → maneja `useAttributes` como Map u objeto.
