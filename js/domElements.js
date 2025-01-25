const createNewElement = (type, className, parentElement, textContent) => {
    const newElement = document.createElement(type);
    newElement.className = className;
    newElement.textContent = textContent;
    parentElement.append(newElement);
    return newElement;
};

const addEventListener = (type, element, callBack) => {
    element.addEventListener(type, callBack);
}