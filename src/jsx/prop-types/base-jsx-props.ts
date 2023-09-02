import type { Target } from "./shared/target";

declare global {
  namespace JSXTE {
    interface BaseTagProps {
      href?: string;
      target?: Target;
    }
  }
}
