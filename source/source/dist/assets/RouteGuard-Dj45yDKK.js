import { u as useLocation } from "./index-CUErrqgd.js";
import "./UserRoleContext-DMxWKclM.js";
import { u as useMenuFunc } from "./useMenuFunc-BrdSDwZ3.js";
import { d as redirectToEntry } from "./utils-BVQ22sob.js";
import "./MenuFuncContext-B04V1YTi.js";
import "./render-uL5zGIDv.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./context-CN2GVsG0.js";
import "./useZIndex-BReSjmbj.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./InfoCircleFilled-6TjWreYB.js";
const RouteGuard = (props) => {
  const { menuPathToIdMap } = useMenuFunc();
  const location = useLocation();
  const publicPaths = ["/welcome", "/"];
  if (publicPaths.includes(location.pathname)) {
    return props.children;
  }
  if (!menuPathToIdMap) {
    return props.children;
  }
  if (!menuPathToIdMap[location.pathname]) {
    redirectToEntry();
    return null;
  }
  return props.children;
};
export {
  RouteGuard as default
};
