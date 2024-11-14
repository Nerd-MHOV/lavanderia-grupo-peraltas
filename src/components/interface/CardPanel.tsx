import { cn } from "@/lib/utils"

interface CardPanelProps {
    title: string
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    noHover?: boolean
    className?: string
    children: React.ReactNode
}

export const CardPanel = ({
    title, Icon, children, className
}: CardPanelProps) => {
    return (
        <div className={cn(`transition-all relative bg-panelWhite p-7 rounded-xl shadow-xl w-full flex flex-col justify-between hover:bg-gray-100/50`, className)}>
            <h2 className="font-bold text-3xl text-panelBlue">{title}</h2>
            <div>
                {children}
            </div>
            <div className="absolute right-5 top-2 opacity-30"><Icon width={60} height={60} /></div>
        </div>
    )
}