import type { SVGProps } from 'react'
import * as React from 'react'

const SvgSidebarScheduleIcon = ({ stroke = 'currentColor', ...props }: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 32" {...props}>
    <path
      stroke={stroke} // 하드코딩된 #8FA0A8 대신 props 반영
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M12.667 7.667V11M19.333 7.667V11M21.833 9.333H10.167c-.92 0-1.667.746-1.667 1.667v11.667c0 .92.746 1.666 1.667 1.666h11.666c.92 0 1.667-.746 1.667-1.666V11c0-.92-.746-1.667-1.667-1.667M8.5 14.333h15M12.667 17.667h.008M16 17.667h.008M19.333 17.667h.009M12.667 21h.008M16 21h.008M19.333 21h.009"
    />
  </svg>
)

export default SvgSidebarScheduleIcon
