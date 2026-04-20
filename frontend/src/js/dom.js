export const el = (tag, className = '', text = '') => {
  const element = document.createElement(tag);
  if (className) {
    // allow multiple classes space separated
    className.split(' ').forEach(cls => {
      if(cls) element.classList.add(cls);
    });
  }
  if (text) element.textContent = text;
  return element;
};

export const appendChildren = (parent, children) => {
  children.forEach(child => {
    if(child) parent.appendChild(child);
  });
  return parent;
};
