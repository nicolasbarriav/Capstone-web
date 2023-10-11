export default function classNames(...classes: (string | boolean)[]) {
  return classes
    .filter((item): item is string => typeof item === 'string')
    .join(' ');
}
