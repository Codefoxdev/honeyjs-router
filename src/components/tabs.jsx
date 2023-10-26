import { createSignal, createRef, onMount, createGesture, createEffect } from "@honeyjs/core";
import { registerPath, getPath } from "../navigation/navigation.js";
import { navigate } from "../index.js";

/**
 * @type {import("../types/index").createTabsNavigator}
 */
export function createTabsNavigator() {
  let screens = [];
  let buttons = [];

  let styleFn;
  let swipe = false;

  const [navigator, navigatorRef] = createRef();
  const [tabbar, tabbarRef] = createRef();

  const [offset, setOffset] = createSignal(0);
  const [page, setPage] = createSignal(0);

  const res = {
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

      // Setup buttons and gesture controls
      res.setupButtons(props.children);
      res.setupGestures();

      // Show correct screen on load
      getPath()?.callback();

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
            }} ref={tabbarRef}>
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
    // TODO: Correct screen should show on load
    Screen(props) {
      screens.push(props);
      const index = screens.indexOf(props);

      registerPath(props.path, () => res.page(index));

      return (
        <div data-type="honey-screen" data-path={props.path} data-name={props.name} data-index={screens.length - 1}>
          {props.component}
        </div>
      )
    },

    page(index) {
      if (index == undefined || index == null) return page();
      setPage(index);
    },

    setupButtons(children) {
      let first = true;
      buttons = [];

      for (const child of children) {
        const index = child.getAttribute("data-index");
        if (child.getAttribute("data-type") == "honey-screen" && index) {
          const screen = screens[index];
          const { activeColor, inactiveColor, icon: Icon } = styleFn(screen);

          if (first) {
            setPage(index);
            first = false;
          }
          const currentActive = () => page() == index;

          buttons.push((
            <span className="link" active={() => currentActive()} onClick={() => navigate(screen.path)}>
              <Icon color={() => currentActive() ? activeColor : inactiveColor} />
            </span>
          ))
        }
      }
    },
    setupGestures() {
      let width = window.innerWidth;
      const bounds = { min: 0, max: width * (buttons.length - 1) }
      let transitioning = false;

      onMount(() => {
        if (navigator().getAttribute("data-swipe") != "horizontal") return;

        createGesture({
          target: navigator(),
          alias: "router-swipe",
          direction: "horizontal",
          autoStart: true,
          onMove(e) {
            if (e.direction == "vertical") return;
            width = window.innerWidth;
            const lastPos = page() * width;
            if (Math.abs(e.velocity.x) > 20) {
              if (e.delta.x < 0) setPage(Math.min(page() + 1, buttons.length - 1));
              else setPage(Math.max(page() - 1, 0));
              return e.end();
            }

            if (bounds.min < lastPos - e.delta.x && bounds.max > lastPos - e.delta.x) setOffset(lastPos - e.delta.x);
            else setOffset(lastPos - (e.delta.x * 0.2))
            navigator().style.setProperty("margin-left", `${-offset()}px`);
          },
          onEnd(e) {
            if (e.manuallyEnded == false) setPage(Math.round(offset() / width));
          }
        });

        createEffect(() => {
          if (transitioning) return;
          const old = navigator().style.marginLeft ?? "0px";
          transitioning = true;
          width = window.innerWidth;
          setOffset(page() * width);

          navigator().animate([
            { marginLeft: `${old}` },
            { marginLeft: `${-page() * width}px` }
          ], {
            duration: 300,
            easing: "ease",
          });
          navigator().style.setProperty("margin-left", `${-page() * width}px`);
          transitioning = false;
        });
      });
    }
  }

  return res;
}