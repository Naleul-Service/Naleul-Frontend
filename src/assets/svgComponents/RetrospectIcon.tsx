import type { SVGProps } from 'react'
import * as React from 'react'

const SvgRetrospectIcon = ({ stroke = 'currentColor', ...props }: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 32" {...props}>
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M17.167 7.667H11a1.667 1.667 0 0 0-1.667 1.666v13.334A1.667 1.667 0 0 0 11 24.333h10a1.667 1.667 0 0 0 1.667-1.666V16.5M7.667 11H11M7.667 14.333H11M7.667 17.667H11M7.667 21H11"
    />
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M23.815 10.688a1.77 1.77 0 1 0-2.503-2.503l-4.175 4.177a1.67 1.67 0 0 0-.422.711l-.698 2.392a.417.417 0 0 0 .517.517l2.392-.698c.269-.078.514-.223.712-.421z"
    />
  </svg>
)

export default SvgRetrospectIcon
