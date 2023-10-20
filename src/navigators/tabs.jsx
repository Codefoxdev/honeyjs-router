import { createSignal, createRef, onMount, createGesture, createEffect } from "@honeyjs/core";

/**
 * @type {import("../types/index").createTabsNavigator}
 */
export function createTabsNavigator() {
  const [active, setActive] = createSignal("");
  let screens = [];
  let styleFn;
  let swipe = false;

  const [navigator, navigatorRef] = createRef();

  return {
    setStyle(fn) {
      styleFn = fn;
      return this;
    },
    /**
     * @param {object} props
     * @param {Array<HTMLElement>} props.children
     */
    Navigator(props) {
      swipe = props.swipe;
      let first = true;
      let buttons = [];
      for (const child of props.children) {
        const index = child.getAttribute("data-index");
        if (child.getAttribute("data-type") == "honey-screen" && index) {
          const screen = screens[index];
          const { activeColor, inactiveColor, icon: Icon } = styleFn(screen);

          if (first) {
            setActive(screen.name);
            first = false;
          }
          const currentActive = () => active() == screen.name;

          buttons.push((
            <span className="link" active={() => currentActive()} onClick={() => console.log(screen.path)}>
              <Icon color={() => currentActive() ? activeColor : inactiveColor} />
            </span>
          ))
        }
      }

      const [offset, setOffset] = createSignal(0);
      const width = window.innerWidth;
      const bounds = { min: 0, max: width * (buttons.length - 1) }
      let page = 0;

      onMount(() => {
        if (navigator().getAttribute("data-swipe") != "horizontal") return;
        createGesture({
          target: navigator(),
          alias: "router-swipe",
          direction: "horizontal",
          autoStart: true,
          onMove(e) {
            const lastPos = page * width;
            console.log(e.velocity.x);
            /* if (e.delta.x > width / 10 && e.velocity.x <= 60) {
              page = Math.max(page - 1, 0);
              return e.end();
            } else if (e.delta.x < width / 10 && e.velocity.x >= 60) {
              page = Math.max(page + 1, buttons.length);
              return e.end();
            } */

            if (bounds.min < lastPos - e.delta.x && bounds.max > lastPos - e.delta.x) setOffset(lastPos - e.delta.x);
            else setOffset(lastPos - (e.delta.x * 0.2))
            navigator().style.setProperty("margin-left", `${-offset()}px`);
          },
          onEnd(e) {
            const old = offset();
            if (!e.manuallyEnded) page = Math.round(old / width);
            setOffset(width * page);

            navigator().animate([
              { marginLeft: `${-old}px` },
              { marginLeft: `${-offset()}px` }
            ], {
              duration: 300,
              easing: "ease",
            });
            navigator().style.setProperty("margin-left", `${-offset()}px`);
          }
        });
      });

      return (
        <>
          <div className="Navigator" data-swipe={swipe} ref={navigatorRef}>
            {props.children}
          </div>
          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100vw",
            }}>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                alignItems: "center",
                gridTemplateColumns: `repeat(${buttons.length}, 1fr)`,
                justifyContent: "center",
                width: "calc(100vw - 2rem)",
              }}>
              {buttons}
            </div>
          </nav>
        </>
      );
    },
    Screen(props) {
      screens.push(props);
      return (
        <div data-type="honey-screen" data-path={props.path} data-name={props.name} data-index={screens.length - 1}>
          {props.component}
        </div>
      )
    }
  }
}