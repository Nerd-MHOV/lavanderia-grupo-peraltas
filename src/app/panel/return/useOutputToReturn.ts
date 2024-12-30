import React, { useCallback } from 'react'
import { OutputsQuantity } from './return-product';

const useOutputToReturn = () => {
    const [outputToReturn, setOutputToReturn] = React.useState<OutputsQuantity[] | []>([]);
      const addOutputReturn = useCallback((output: OutputsQuantity) => {
        setOutputToReturn((prev) => {
          const out = prev.find((o) => o.id === output.id)
          if (out) {
            const quantity = out.quantity || 0
            out.quantity = out.amount >= quantity + 1 ? quantity + 1 : quantity
            return prev.map((p) => p.id === output.id ? out : p)
          }
          if (!output.amount) return prev
          return [...prev, {
            ...output,
            quantity: 1
          }]
        })
    
      }, [])
    
      const removeOutputReturn = useCallback((output: OutputsQuantity) => {
        setOutputToReturn((prev) => {
          const out = prev.find((p) => p.id === output.id)
          if (out) {
            out.quantity = out.quantity ? out.quantity - 1 : 0
            if (out.quantity === 0) return prev.filter((p) => p.id !== output.id)
            return prev.map((p) => p.id === output.id ? out : p)
          }
          return prev
        })
      }, [])

      return { outputToReturn, addOutputReturn, removeOutputReturn }
}

export default useOutputToReturn