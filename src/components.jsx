import { useLocation, navigate } from "./history";

/**
 * @param {object} props
 * @param {"horizontal" | "vertical" | null} props.swipe Specifies the swipe direction when used on mobile, leave empty or null when swiping isn't used/allowed
 */
export function Router(props) {
  console.log(props.children)
  return (
    <div className="__honey_router" style={{
      display: "flex",
      flexDirection: props.swipe == "vertical" ? "column" : "row",
    }}>
      {props.children}
    </div>
  )
}

/**
 * @param {object} props 
 * @param {string} props.path The path to use at the `component`'s page
 * @param {Function | HTMLElement | Array} props.component The component to render at the `path`
 */
export function Route(props) {
  // check if item has children, than register its subpaths

  return (
    <div path={props.path} className="__honey_router_page" style={props.style ?? ""}>
      {props.component}
    </div>
  )
}

export function AppBar(props) {

}

/**
 * @param {object} param0 
 * @param {string} param0.href The location in pathname format `/path/to/page`
 */
export function A({ href, children }) {
  const onclick = (e) => {
    e.preventDefault();
    navigate(href);
  }
  return (
    <a href={href} onClick={onclick}>{children}</a>
  )
}