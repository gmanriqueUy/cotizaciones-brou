# Cotizaciones BROU

## El problema

No existe una API pública para obtener las cotizaciones del [BROU](https://www.brou.com.uy)

## Esta solución

Este proyecto implementa una REST API abierta que puede ser utilizada para obtener cotizaciones de las siguientes monedas en Pesos Uruguayos:

- **USD**: Dólar Estadounidense
- **ARS**: Peso Argentino
- **BRL**: Real Brasileño
- **EUR**: Euro

Está alojada en [Fly.io](https://fly.io/).

_Dato curioso: La cotización más antigua accesible a traves de esta API es del 30 de diciembre de 1999._

## Los datos

Los datos son obtenidos desde el [Histórico de Cotizaciones](http://www.ine.gub.uy/web/guest/cotizacion-de-monedas) del **Instituto Nacional de Estadística del Uruguay**.

Particularmente, la base de datos de genera a partir de [este archivo XLS ](https://www5.ine.gub.uy/documents/Estad%C3%ADsticasecon%C3%B3micas/SERIES%20Y%20OTROS/Cotizaci%C3%B3n%20de%20monedas/Cotizaci%C3%B3n%20monedas.xlsx).

## ¿Cómo se usa?

### URL base

https://cotizaciones-brou-v2-e449.fly.dev

### Endponits

#### **GET /currency/latest**

Devuelve las cotizaciones más recientes disponibles

- URL: `/currency/latest`
- Método: `GET`
- Respuesta exitosa:
  `GET /currency/latest`
  ```json
  {
    "base": "UYU",
    "timestamp": 1681430400000,
    "dateISOString": "2023-04-14",
    "rates": {
      "USD": {
        "buy": 37.6,
        "sell": 40
      },
      "ARS": {
        "buy": 0.05,
        "sell": 0.35
      },
      "BRL": {
        "buy": 7.73,
        "sell": 9.53
      },
      "EUR": {
        "buy": 40.53,
        "sell": 45.45
      }
    }
  }
  ```

#### **GET /currency/:date**

Devuelve las cotizaciones vigentes para la fecha indicada por el parámetro `date`. Si no hay cotizaciones para esa fecha, se devuelven las más recientes previo a la misma.

Por ejemplo, `GET /currency/2018-10-07` devuelve las cotizaciones del 5 de octubre de 2018, debido a que el 7 fue domingo y no hay cotizaciones para ese día; las más recientes previo a esa fecha son las del viernes 5 de octubre.

- URL: `/currency/:date`
- Método: `GET`
- Params:
  - `date` (requerido): Fecha con formato `YYYY-MM-DD`.
    Ej: `2018-10-07` para las cotizaciones vigentes al 7 de octubre del 2018.
- Respuesta exitosa:
  `GET /currency/2018-10-07`
  ```json
  {
    "base": "UYU",
    "timestamp": 1538697600000,
    "dateISOString": "2018-10-05",
    "rates": {
      "USD": {
        "buy": 32.34,
        "sell": 33.74
      },
      "ARS": {
        "buy": 0.58,
        "sell": 1.18
      },
      "BRL": {
        "buy": 7.88,
        "sell": 8.88
      },
      "EUR": {
        "buy": 36.34,
        "sell": 39.96
      }
    }
  }
  ```
- Respuesta cuando la fecha es inválida:
  `GET /currency/2018-10-32`

  `Status code: 400 - Invalid date`
