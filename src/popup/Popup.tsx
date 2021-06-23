import React, { useEffect, useState } from "react";
import "./Popup.scss";
import { copyTextToClipboard } from "./utils";

export default function Popup(): JSX.Element {
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

  const processBookmarkNode = (
    bookmark: chrome.bookmarks.BookmarkTreeNode,
    level: number
  ) => {
    let result = ``;
    if (!bookmark.children) {
      if (
        bookmark.title &&
        bookmark.url &&
        !bookmark.url.startsWith("chrome://")
      ) {
        result += `- [${bookmark.title}](${bookmark.url})\n\n`;
      }
    } else {
      if (bookmark.children.length > 0) {
        const headingLevel = Array(level > 5 ? 6 : level + 1)
          .fill("#")
          .join("");
        if (bookmark.title) result += `${headingLevel} ${bookmark.title}\n\n`;
        result += bookmark.children
          .map((item) => processBookmarkNode(item, level + 1))
          .join("");
        result += `\n\n`;
      }
    }
    return result;
  };

  const exportBookmarks = () => {
    let bookmarksMd = ``;
    chrome.bookmarks.getTree((bookmarks) => {
      console.log(bookmarks);
      bookmarks.forEach((bookmark) => {
        bookmarksMd += processBookmarkNode(bookmark, 0);
      });
      copyTextToClipboard(bookmarksMd);
      setCopiedMessage(true);
      setTimeout(() => {
        setCopiedMessage(false);
      }, 4000);
    });
  };

  return (
    <div className="popupContainer">
      <div>
        <button onClick={exportBookmarks}>Export bookmarks</button>
      </div>
      {copiedMessage && <p>Copied!</p>}
    </div>
  );
}
