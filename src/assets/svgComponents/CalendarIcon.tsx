import type { SVGProps } from 'react'
import * as React from 'react'

const SvgCalendarIcon = ({ stroke = 'currentColor', ...props }: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 20 20" {...props}>
    <path
      stroke={stroke} // 하드코딩된 #475660 대신 props 반영
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M6.667 1.667V5M13.333 1.667V5M15.833 3.333H4.167C3.247 3.333 2.5 4.08 2.5 5v11.667c0 .92.746 1.666 1.667 1.666h11.666c.92 0 1.667-.746 1.667-1.666V5c0-.92-.746-1.667-1.667-1.667M2.5 8.333h15M6.667 11.667h.008M10 11.667h.008M13.333 11.667h.009M6.667 15h.008M10 15h.008M13.333 15h.009"
    />
  </svg>
)

export default SvgCalendarIcon
