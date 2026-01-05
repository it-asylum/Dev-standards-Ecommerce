import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'estrategiaModalDcto',
] as const

const Greeting = () => {

  const handles = useCssHandles(CSS_HANDLES)

  const productContextValue = useProduct();

  const category = productContextValue.product.categoryId

  console.log("productContextValue", productContextValue)

  return (
    <div className={handles.estrategiaModalDcto}>Id de la categoria {category}</div>
  )
}

export default Greeting
