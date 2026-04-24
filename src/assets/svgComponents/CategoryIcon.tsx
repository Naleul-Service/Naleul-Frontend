import type { SVGProps } from 'react'
import * as React from 'react'

const SvgCategoryIcon = ({
  stroke = 'currentColor', // 기본값을 currentColor로 설정 (부모의 text color를 따름)
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 32" {...props}>
    <g
      stroke={stroke} // 하드코딩된 #8FA0A8 대신 props로 받은 stroke 적용
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      clipPath="url(#category-icon_svg__a)"
    >
      <path d="M15.167 16a.833.833 0 1 0 1.666 0 .833.833 0 0 0-1.666 0" />
      <path d="M16 11.833A4.166 4.166 0 1 0 20.167 16" />
      <path d="M16.833 8.546a7.5 7.5 0 1 0 6.618 6.62" />
      <path d="M18.5 11v2.5H21l2.5-2.5H21V8.5zM18.5 13.5 16 16" />
    </g>
    <defs>
      <clipPath id="category-icon_svg__a">
        <path fill="#fff" d="M6 6h20v20H6z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgCategoryIcon
