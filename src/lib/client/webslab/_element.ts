import { LitElement, type PropertyValues } from "lit";

export abstract class WebslabElement extends LitElement {
  emit<T extends string>(name: T, options?: CustomEventInit): CustomEvent<T> {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);
    return event as CustomEvent<T>;
  }

  protected checkRequiredProps() {
    // @ts-ignore
    const requiredProps: string[] = this.constructor.requiredProps || [];
    const missing = requiredProps.filter((prop) => {
      return (this as Record<string, unknown>)[prop] == null;
    });

    if (missing.length > 0) {
      const message = `Missing required prop(s): ${missing.join(", ")}`;
      this.emit("wl-props:error", { detail: { message } });
      throw new Error(message);
    }
  }

  protected viewTransition(cb: () => void) {
    if ("startViewTransition" in document) {
      return document.startViewTransition(() => cb());
    } else cb();
  }

  willUpdate(changedProperties: PropertyValues) {
    this.checkRequiredProps();
    super.willUpdate(changedProperties);
  }
}
