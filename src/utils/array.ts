export const isDefined = <T>(el: T | undefined | null): el is T => {
  return !!el;
};
