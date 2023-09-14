declare global {
  namespace JSX {
    interface IntrinsicElements {
      [index: string]: {
        [index: string]: any;
        onclick?: (evt: MouseEvent) => void;
      };
    }
  }
}

interface Element {
  __type: "element";
  tagname: string;
  props: Record<string, any>;
  children: Array<HNode>;
}

interface Fragment {
  __type: "fragment";
  children: Array<HNode>;
}

type HNode =
  | Element
  | Fragment
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined;

export const FragmentDescriptor = Symbol("Fragment");

export function h(
  tagname: string | typeof FragmentDescriptor,
  props: any,
  ...children: []
): HNode {
  return tagname === FragmentDescriptor
    ? { __type: "fragment", children }
    : { tagname, props, children, __type: "element" };
}

export function render(node: HNode) {
  if (node === null || node === undefined) {
    return null;
  }

  if (typeof node === "boolean") {
    return null;
  }

  if (typeof node !== "object") {
    return document.createTextNode(String(node));
  }

  let element: DocumentFragment | HTMLElement | null = null;
  if (node.__type === "element") {
    element = document.createElement(node.tagname);
    for (const [k, v] of Object.entries(node.props ?? {})) {
      if (k.startsWith("on")) {
        const evtName = k.slice(2);
        element.addEventListener(evtName, v);
      }
      element.setAttribute(k, v);
    }
  }

  if (node.__type === "fragment") {
    element = document.createDocumentFragment();
  }

  for (let child of node.children) {
    const domNode = render(child);
    if (domNode) {
      element?.appendChild(domNode);
    }
  }

  return element;
}
