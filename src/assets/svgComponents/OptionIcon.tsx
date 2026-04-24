import type { SVGProps } from 'react'
import * as React from 'react'

interface OptionIconProps extends SVGProps<SVGSVGElement> {
  iconColor?: string // 원하는 경우 특정 색상을 props로 직접 넘길 수 있도록 추가
}

const SvgOptionIcon = ({ iconColor, ...props }: OptionIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 32" {...props}>
    <g
      // iconColor가 있으면 그 값을 쓰고, 없으면 부모의 글자색(currentColor)을 따릅니다.
      stroke={iconColor || 'currentColor'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      clipPath="url(#option-icon_svg__a)"
    >
      <path d="M16 16.833a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666M16 11a.833.833 0 1 0 0-1.667A.833.833 0 0 0 16 11M16 22.667A.833.833 0 1 0 16 21a.833.833 0 0 0 0 1.667" />
    </g>
    <defs>
      <clipPath id="option-icon_svg__a">
        <path fill="#fff" d="M6 6h20v20H6z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgOptionIcon
