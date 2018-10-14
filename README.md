# Cotizaciones BROU

[![Build Status](https://travis-ci.org/gmanriqueUy/cotizaciones-brou.svg?branch=master)](https://travis-ci.org/gmanriqueUy/cotizaciones-brou)

## El problema

No existe una API pública para obtener las cotizaciones del [BROU](https://www.brou.com.uy)

## Esta solución

Este proyecto implementa una REST API abierta (alojada en [Heroku](https://heroku.com)) que puede ser utilizada para obtener cotizaciones de las siguientes monedas en Pesos Uruguayos:

- Dólar Estadounidense
- Peso Argentino
- Real Brasileño
- Euro

Dato curioso: La cotización más antigua accesible a traves de esta API es del 30 de diciembre de 1999.

## Los datos

Los datos son obtenidos desde el [Histórico de Cotizaciones](http://www.ine.gub.uy/web/guest/cotizacion-de-monedas) del **Instituto Nacional de Estadística del Uruguay**.

Particularmente, la base de datos de genera a partir de [este archivo XLS ](http://www.ine.gub.uy/c/document_library/get_file?uuid=1dcbe20a-153b-4caf-84a7-7a030d109471).

## ¿Cómo se usa?

### URL base
https://cotizaciones-brou.herokuapp.com/api

### Endponits

#### **GET /currency/latest**

Devuelve las cotizaciones más recientes disponibles

- URL: `/currency/latest`
- Método: `GET`
- Respuesta de ejemplo:
  `GET /currency/latest`
  ```json
  {
    "base": "UYU",
    "timestamp": 1539302400,
    "rates": {
      "ARS": {
        "sell": 1.22,
        "buy": 0.62
      },
      "BRL": {
        "sell": 9.15,
        "buy": 8.15
      },
      "EUR": {
        "sell": 40.16,
        "buy": 36.52
      },
      "USD": {
        "sell": 33.68,
        "buy": 32.28
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
    Ej: `2018-09-26` para las cotizaciones vigentes al 26 de setiembre del 2018.
- Respuesta exitosa:
  `GET /currency/2018-10-13`
  ```json
  {
    "base": "UYU",
    "timestamp": 1539302400,
    "rates": {
      "ARS": {
        "sell": 1.22,
        "buy": 0.62
      },
      "BRL": {
        "sell": 9.15,
        "buy": 8.15
      },
      "EUR": {
        "sell": 40.16,
        "buy": 36.52
      },
      "USD": {
        "sell": 33.68,
        "buy": 32.28
      }
    }
  }
  ```
- Respuesta cuando la fecha es inválida:
  ```json
  GET /currency/2018-10-32

  [
    {
      "location": "params",
      "param": "date",
      "value": "2018-10-32",
      "msg": "Date must be with YYYY-MM-DD format or 'latest'"
    }
  ]
  ```
