import { r as reactExports, P as useLayoutEffect } from "./index-CUErrqgd.js";
import { u as useResponsiveObserver } from "./responsiveObserver-ChKXsNUO.js";
function useForceUpdate() {
  const [, forceUpdate] = reactExports.useReducer((x) => x + 1, 0);
  return forceUpdate;
}
function useBreakpoint() {
  let refreshOnChange = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
  const screensRef = reactExports.useRef({});
  const forceUpdate = useForceUpdate();
  const responsiveObserver = useResponsiveObserver();
  useLayoutEffect(() => {
    const token = responsiveObserver.subscribe((supportScreens) => {
      screensRef.current = supportScreens;
      if (refreshOnChange) {
        forceUpdate();
      }
    });
    return () => responsiveObserver.unsubscribe(token);
  }, []);
  return screensRef.current;
}
export {
  useForceUpdate as a,
  useBreakpoint as u
};
