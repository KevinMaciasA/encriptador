class EventHandler {
  /**
   * @param {HTMLElement} element The html element to handle clicks.
   * @param {keyof DocumentEventMap} eventType Key string of the event type.
   * @returns {EventHandler} The sum of x and y.
   */
  constructor(element, eventType) {
    this.element = element;
    this.eventType = eventType;
    this.stack = [];
  }

  swap(event) {
    this.clear();
    this.push(event);
  }

  push(event) {
    this.element.addEventListener(this.eventType, event);
    this.stack.push(event);
  }

  pop() {
    const last = this.stack.pop();
    this.element.removeEventListener(this.eventType, last);
  }

  clear() {
    this.stack.forEach((event) =>
      this.element.removeEventListener(this.eventType, event)
    );
  }
}

export default EventHandler;
