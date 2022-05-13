export const pad = (length: number, char = " ") => {
  return Array.from({ length }, () => char).join("");
};
