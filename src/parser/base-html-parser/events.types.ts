export type EventCallback = (e: Event) => void;

export type BaseHTMLEvents = {
  onClick: MouseEvent;
  onDrag: DragEvent;
  onDragEnd: DragEvent;
  onDragEnter: DragEvent;
  onDragLeave: DragEvent;
  onDragOver: DragEvent;
  onDragStart: DragEvent;
  onMouseDown: MouseEvent;
  onMouseEnter: MouseEvent;
  onMouseLeave: MouseEvent;
  onMouseMove: MouseEvent;
  onMouseOut: MouseEvent;
  onMouseOver: MouseEvent;
  onMouseUp: MouseEvent;
  onTouchCancel: TouchEvent;
  onTouchEnd: TouchEvent;
  onTouchMove: TouchEvent;
  onTouchStart: TouchEvent;
};
