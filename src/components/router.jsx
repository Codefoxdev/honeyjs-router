import { useLocation, navigate } from "../navigation/history";

// TODO: Add preserve similar back with appbar and navbar etc.

/**
 * @param {object} props
 * @param {"horizontal" | "vertical" | null} props.swipe Specifies the swipe direction when used on mobile, leave empty or null when swiping isn't used/allowed
 */
export function Router(props) {
  return props.children;
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

/**
 * @typedef {object} ViewOptions
 * @property {boolean} showAppBar Show the appbar if it is used defaults to false
 * 
 * @param {object} props
 * @param {ViewOptions} props.options
 * @param {React.CSSProperties} props.style
 * @returns 
 */
export function View(props) {
  return (
    <div className="__honey_router_view" style={props.style ?? ""}>
      {props.children}
    </div>
  )
}

/**
 * @param {import("@honeyjs/core").ComponentProps} props
 */
export function Screen(props) {

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