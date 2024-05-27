export default function isIterable(obj: any) {
  if (obj == null) return false;

  return typeof obj[Symbol.iterator] === "function";
}

export function delayTime(duration: number = 3000) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function generateId(){
  const id = Math.random().toString(16).slice(2);

  return id;
}

export function isServerSide(){
  return typeof window === 'undefined';
}
