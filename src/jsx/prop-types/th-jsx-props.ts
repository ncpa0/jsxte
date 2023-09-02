declare global {
  namespace JSXTE {
    interface ThTagProps {
      abbr?: string;
      colspan?: string | number;
      headers?: string;
      rowspan?: string | number;
      scope?: "col" | "colgroup" | "row" | "rowgroup";
    }
  }
}

export {};
