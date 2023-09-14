import { h, render } from "./h";

const IS_TWEET_PATH = /^\/[^/]+\/status\/\d+\/?$/;
const DATASET_PROCESSED_NAME = "twitterShowEngagementsProcessed";
const ROOT_CLASS_NAME = "twitter-show-engagements";

function isAnchor(node?: Element | null): node is HTMLAnchorElement {
  return node?.tagName === "A";
}

type TSAnchorChild = Omit<HTMLTimeElement, "parentElement"> & {
  parentElement: HTMLAnchorElement;
};

function isTweetTimestamp(node: Element): node is TSAnchorChild {
  const parent = node.parentElement;
  if (!isAnchor(parent)) {
    return false;
  }

  const href = parent.href;
  if (!href) {
    return false;
  }

  const fullUrl = new URL(href, location.href);
  const isTweetPath = IS_TWEET_PATH.test(fullUrl.pathname);

  return isTweetPath;
}

function main() {
  const timestamps = [...document.querySelectorAll("time")]
    .filter(isTweetTimestamp)
    .filter(($) => $.dataset[DATASET_PROCESSED_NAME] === undefined);

  timestamps.forEach((ts) => {
    ts.dataset[DATASET_PROCESSED_NAME] = "true";
    const insertionPoint = ts.parentElement.parentElement;
    if (!insertionPoint) {
      return;
    }

    const baseLink = ts.parentElement.href.replace(/\/$/, "");
    const engagements = render(
      <span onclick={(evt) => evt.stopPropagation()} class={ROOT_CLASS_NAME}>
        {"("}
        <a href={baseLink + "/likes"}>L</a> /{" "}
        <a href={baseLink + "/reposts"}>R</a> /{" "}
        <a href={baseLink + "/quotes"}>Q</a>
        {")"}
      </span>,
    );

    if (!engagements) {
      return;
    }
    insertionPoint.appendChild(engagements);
  });
}

setInterval(main, 250);

const css = `
  .${ROOT_CLASS_NAME}.${ROOT_CLASS_NAME} {
    color: rgb(139, 152, 165);
    padding-left: 4px;
    font-family: "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .${ROOT_CLASS_NAME}.${ROOT_CLASS_NAME} a {
    color: rgb(247, 249, 249);
  }
`.trim();

const style = render(<style>{css}</style>);
if (style) {
  document.head.appendChild(style);
}
