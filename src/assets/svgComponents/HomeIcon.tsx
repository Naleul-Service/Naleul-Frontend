import type { SVGProps } from 'react'
import * as React from 'react'

const SvgHomeIcon = ({ stroke = 'currentColor', ...props }: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 32" {...props}>
    <g
      stroke={stroke} // 하드코딩된 색상 대신 props 반영
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      clipPath="url(#home-icon_svg__a)"
    >
      <path d="M8.5 13.5 16 7.667l7.5 5.833v9.167a1.667 1.667 0 0 1-1.667 1.666H10.167A1.667 1.667 0 0 1 8.5 22.667z" />
      <path d="M13.5 24.333V16h5v8.333" />
    </g>
    <defs>
      <clipPath id="home-icon_svg__a">
        <path fill="#fff" d="M6 6h20v20H6z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgHomeIcon
