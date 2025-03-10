import { mergeAttributes, Node } from "@tiptap/core";
import styles from "./Block.module.css";
export interface IBlock {
  HTMLAttributes: Record<string, any>;
}

export const ContentBlock = Node.create<IBlock>({
  name: "content",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      position: {
        default: undefined,
        renderHTML: (attributes) => {
          return {
            "data-position": attributes.position,
          };
        },
        parseHTML: (element) => element.getAttribute("data-position"),
      },
    };
  },

  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (element) => {
          if(typeof element === "string") {
            return false;
          }

          if(element.getAttribute("data-node-type") === "block-content") {
            // Null means the element matches, but we don't want to add any attributes to the node.
            return null;
          }

          return false;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: styles.blockContent,
        "data-node-type": "block-content"
      }),
      // TODO: The extra nested div is only needed for placeholders, different solution (without extra div) would be preferable
      // We can't use the other div because the ::before attribute on that one is already reserved for list-bullets
      ["div", 0],
    ];
  },
});
