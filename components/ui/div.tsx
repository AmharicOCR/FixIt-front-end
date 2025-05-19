import * as React from "react"

const Div = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={className} ref={ref} {...props} />
))
Div.displayName = "Div"

export { Div }
