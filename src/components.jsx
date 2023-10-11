import { useLocation } from "./history";

/**
 * @param {object} props
 * @param {"horizontal" | "vertical" | null} props.swipe Specifies the swipe direction when used on mobile, leave empty or null when swiping isn't used/allowed
 */
export function Router(props) {
  return (
    <>
      {props.children}
    </>
  )
}

/**
 * @param {object} props 
 * @param {string} props.path The path to use at the `component`'s page
 * @param {Function | HTMLElement | Array} props.component The component to render at the `path`
 */
export function Route(props) {
  const [location] = useLocation();
  return (
    <>
      {() => location() ?? <props.component />}
    </>
  )
}

/**
 * @param {object} param0 
 * @param {string} param0.href The location in pathname format `/path/to/page`
 */
export function A({ href, children }) {
  const onclick = (e) => {
    e.preventDefault();
    //navigate(href);
  }
  return (
    <a href={href} onClick={onclick}>{children}</a>
  )
}