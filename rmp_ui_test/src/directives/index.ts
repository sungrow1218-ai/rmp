const directiveMap: Recordable = {};

export function directive(name: string, factory: Function) {
  directiveMap[name] = factory;
}

export function applyDirective(
  el: HTMLElement,
  name: string,
  binding: { value: (e: any) => void; arg: string }
) {
  const factory = directiveMap[name];
  if (!factory) return null;
  return factory(el, binding);
}

// 注册全局指令
directive(
  'eipInterceptor',
  (el: HTMLElement, binding: { value: (e: any) => void; arg: string }) => {
    const eventType = binding.arg || 'click';

    const handler = (e: any) => {
      binding.value(e);
    };

    el.addEventListener(eventType, handler);
    return () => el.removeEventListener(eventType, handler);
  }
);
