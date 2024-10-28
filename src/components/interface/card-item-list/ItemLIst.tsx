'use client'
import { cn } from "@/lib/utils"
import { Delete } from "lucide-react"

interface ItemListProps extends React.HTMLAttributes<HTMLDivElement> {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    buttons?: {
        delete: () => void
        add: () => void
        quantity: number
    }
    title?: string
    describe?: string
}
const ItemList = ({ Icon, buttons, title, describe, ...props }: ItemListProps) => {
    return (
        <div tabIndex={-1} {...props}  className={cn('transition-all flex drop-shadow-md hover:drop-shadow-xl rounded-sm bg-white gap-5  p-3 ', props.className)} >
            <BallContent className='bg-primary hover:bg-primary cursor-default'>
                <Icon className='text-white' width={30} height={30} />
            </BallContent>
            <div className='flex justify-between w-full'>
                <div className="flex flex-col items-start">
                    <h1 className="font-semibold text-base">{title}</h1>
                    <p className="text-gray-600 text-sm">{describe}</p>
                </div>
                {
                    buttons && <div className="flex gap-3">
                        <BallContent onClick={buttons.add}>
                            <p>{buttons.quantity}</p>
                        </BallContent>
                        <BallContent onClick={buttons.delete} className='bg-red-500 hover:bg-red-400'>
                            <Delete className="text-white" />
                        </BallContent>
                    </div>
                }
            </div>
        </div>
    )
}

interface BallContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode, className?: string
}

const BallContent = ({ children, className, ...props }: BallContentProps) => {
    return (
        <div {...props} className={cn("cursor-pointer bg-gray-200 hover:bg-gray-100 rounded-full w-12 h-12 flex justify-center items-center", className)}>
            {children}
        </div>
    )
}

export default ItemList