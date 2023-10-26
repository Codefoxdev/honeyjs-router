import type * as Honey from "@honeyjs/core";

declare interface ScreenOptions {
  /**
   * The alias for a group of screens, can only be used by the top most screen.
   * This property will be passed down all of its children
   */
  name: string;
  /**
   * The path of the screen, if it is a chidren of a Screen it should be relative to its path
   */
  path: string;
  /**
   * The Component to render at the given route
   */
  component: Honey.Component;
}

declare interface TabsNavigator {
  setStyle(fn: (screen: ScreenOptions) => NavigatorStyle): TabsNavigator;

  /**
   * The Navigator component is responsible for showing the right screen, add screens by using the `TabsNavigator.Screen` component
   */
  Navigator(props: { swipe: "horizontal" | null }): Honey.Component;
  /**
   * Creates a screen when inside of the `TabsNavigator.Navigator` component
   */
  Screen(props: ScreenOptions): Honey.Component;

  page(index?: number): void;
  setupGestures(): void;
}

declare interface NavigatorStyle {
  icon(props: { color: string }): Honey.Component;
  activeColor: Honey.Color;
  inactiveColor: Honey.Color;
}

export function createTabsNavigator(): TabsNavigator;

export function useLocation(): Location;
