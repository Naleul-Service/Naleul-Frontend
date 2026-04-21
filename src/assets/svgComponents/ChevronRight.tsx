// ChevronRight.tsx
import type { SVGProps } from 'react'

interface ChevronRightProps extends SVGProps<SVGSVGElement> {
  color?: string
}

const ChevronRight = ({ color = 'currentColor', ...props }: ChevronRightProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 20 20" {...props}>
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="m7.5 15 5-5-5-5" />
  </svg>
)

export default ChevronRight
