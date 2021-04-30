export type ListNode<T> = {
  value: T;
  next: ListNode<T> | null;
}

export function createNode<T>(value: T): ListNode<T> {
  return ({
    value,
    next: null
  });
}

export function addNewTask<T>(list: ListNode<T>, task: ListNode<T>) {
  let _head = list;

  while (_head.next !== null) {
    _head = _head.next;
  }

  _head.next = task;
}

export function unlinkHead<T>(list: ListNode<T>): ListNode<T> {
  const head = list;

  list = list.next;
  head.next = null;

  return list;
}
