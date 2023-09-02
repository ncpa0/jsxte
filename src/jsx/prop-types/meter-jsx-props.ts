declare global {
  namespace JSXTE {
    interface MeterTagProps {
      form?: string;
      high?: string | number;
      low?: string | number;
      max?: string | number;
      min?: string | number;
      optimum?: string | number;
      value?: string | number;
    }
  }
}

export {};
