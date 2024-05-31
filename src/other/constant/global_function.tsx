export default function isIterable(obj: any) {
  if (obj == null) return false;

  return typeof obj[Symbol.iterator] === "function";
}

export function delayTime(duration: number = 3000, cleanup?: boolean) {
  return new Promise((resolve, reject) => {
    if (cleanup) {
      reject();
    }
    setTimeout(() => {
      if (cleanup) {
        reject();
      }
      resolve(null);
    }, duration);
  });
}

export function generateId() {
  const id = Math.random().toString(16).slice(2);

  return id;
}

export function isServerSide() {
  return typeof window === "undefined";
}

export function getXAndYFromTransformProperty(el: HTMLDivElement) {
  let positionTransform = el.style.transform
    .replaceAll("translateX", "")
    .replaceAll("translateY", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("px", "")
    .split(" ");

  return positionTransform;
}
