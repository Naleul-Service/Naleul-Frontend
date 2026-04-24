import type { SVGProps } from 'react'
import * as React from 'react'

const SvgGoalIcon = ({ stroke = 'currentColor', ...props }: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 32" {...props}>
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M14.333 18.217v1.355a1.67 1.67 0 0 1-.813 1.413 4.17 4.17 0 0 0-1.687 3.33M17.667 18.217v1.355a1.67 1.67 0 0 0 .813 1.413 4.17 4.17 0 0 1 1.687 3.33M21 13.5h1.25a2.083 2.083 0 0 0 0-4.167H21M9.333 24.333h13.334"
    />
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M11 13.5a5 5 0 0 0 10 0v-5a.833.833 0 0 0-.833-.833h-8.334A.833.833 0 0 0 11 8.5zM11 13.5H9.75a2.083 2.083 0 0 1 0-4.167H11"
    />
  </svg>
)

export default SvgGoalIcon
