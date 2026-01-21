# Fulfillment & Tracking Notifier (Shopify GraphQL 2025-07)

> **Tienda:** rubyrosecolombiaoficial  
> **Endpoint GraphQL:** `https://rubyrosecolombiaoficial.myshopify.com/admin/api/2025-07/graphql.json`  
> **Headers requeridos:**  
> - `X-Shopify-Access-Token: <ADMIN_API_ACCESS_TOKEN>`  
> - `Content-Type: application/json`  

Permisos necesarios: **`write_fulfillments`** (y `read_orders` en algunos casos).

---

## 1. Crear un Fulfillment (con correo al cliente)

**Objetivo:** crear la guía de envío, marcar ítems como despachados y notificar al cliente por correo.

### Mutación
```graphql
mutation Fulfill($fulfillment: FulfillmentInput!, $message: String) {
  fulfillmentCreate(fulfillment: $fulfillment, message: $message) {
    fulfillment {
      id
      status
      trackingInfo { company number url }
    }
    userErrors { field message }
  }
}
```

### Variables de ejemplo
```json
{
  "fulfillment": {
    "notifyCustomer": true,
    "trackingInfo": {
      "company": "Servientrega",
      "number": "GUIA12345678912",
      "url": "https://tracking.servientrega.tld/GUIA1234567890"
    },
    "lineItemsByFulfillmentOrder": [
      {
        "fulfillmentOrderId": "gid://shopify/FulfillmentOrder/9174001910066",
        "fulfillmentOrderLineItems": [
          { "id": "gid://shopify/FulfillmentOrderLineItem/18610736726322", "quantity": 1 }
        ]
      }
    ]
  },
  "message": "Fulfillment creado con guía de Servientrega"
}
```

## 2. Reenviar notificación y/o actualizar tracking

**Objetivo:** actualizar la guía (transportadora/URL/número) y reenviar el correo de tracking sin crear un fulfillment nuevo.

### Mutación
```graphql
mutation UpdateTrackingReNotify(
  $fulfillmentId: ID!,
  $trackingInfoInput: FulfillmentTrackingInput!,
  $notifyCustomer: Boolean = true
) {
  fulfillmentTrackingInfoUpdate(
    fulfillmentId: $fulfillmentId,
    trackingInfoInput: $trackingInfoInput,
    notifyCustomer: $notifyCustomer
  ) {
    fulfillment {
      id
      status
      trackingInfo { company number url }
    }
    userErrors { field message }
  }
}
```

### Variables de ejemplo
```json
{
  "fulfillmentId": "gid://shopify/Fulfillment/6854207635543",
  "notifyCustomer": true,
  "trackingInfoInput": {
    "company": "Coordinadora",
    "number": "07898100599",
    "url": "https://coordinadora.com/rastreo/rastreo-de-guia/detalle-de-rastreo-de-guia/?guia=07898100599"
  }
}
```

## Buenas prácticas

- Validar que el `FulfillmentOrder` no esté totalmente cumplido antes de crear uno nuevo.
- Enviar `notifyCustomer: true` para disparar el correo de Shopify.

