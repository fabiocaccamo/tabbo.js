(function () {
    const tabbo = {
        activate: function (options) {
            // TODO: accept options
            addListeners();
        },
        deactivate: function () {
            removeListeners();
        },
    };

    let latestFocusedElement = null;
    let latestFocusedElementBeforeModal = null;
    let latestEnteredElement = null;

    function addListeners() {
        window.addEventListener('focus', handleFocusEvent, true);
        window.addEventListener('blur', handleBlurEvent, true);
        window.addEventListener('keydown', handleKeyDownEvent, true);
    }

    function removeListeners() {
        window.removeEventListener('focus', handleFocusEvent);
        window.removeEventListener('blur', handleBlurEvent);
        window.removeEventListener('keydown', handleKeyDownEvent);
    }

    function handleFocusEvent(event) {
        if (isElementWindowOrDocument(event.target)) {
            return;
        }
        latestFocusedElement = event.target;
    }

    function handleBlurEvent(event) {
        latestFocusedElement = null;
    }

    function handleKeyDownEvent(event) {
        if (isElementWindowOrDocument(event.target)) {
            return;
        }
        if (event.key === 'Tab') {
            return handleKeyDownTabEvent(event);
        } else if (event.key === 'Enter') {
            return handleKeyDownEnterEvent(event);
        }
    }

    function handleKeyDownTabEvent(event) {
        // if there is a focusable modal, let's trap the tabbing inside it
        const focusableModalElements = getFocusableModalElementsSortedByZIndex();
        let focusableElementsParent = null;
        if (focusableModalElements.length > 0) {
            // use the top level modal as it should be the top-level one,
            focusableElementsParent =
                focusableModalElements[focusableModalElements.length - 1];
            if (!latestFocusedElementBeforeModal) {
                latestFocusedElementBeforeModal =
                    latestEnteredElement || latestFocusedElement || event.target;
            }
        }
        // get list of focusable elements (only modal elements if a modal is open)
        const focusableElements = getFocusableElementsSortedByTabindex(
            focusableElementsParent
        );
        if (focusableElements.length === 0) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
        }
        // find the current focused element for start tabbing from it
        let prevFocusableElement = [
            latestFocusedElementBeforeModal,
            latestEnteredElement,
            latestFocusedElement,
            event.target,
        ].find(function (element) {
            return element && focusableElements.indexOf(element) !== -1;
        });
        // check the next focusable element (all its ancestors must be focusable)
        let nextFocusableElement = null;
        let nextFocusableElementIndex = focusableElements.indexOf(prevFocusableElement);
        if (nextFocusableElementIndex === -1) {
            nextFocusableElementIndex = 0;
        } else {
            // if shift is pressed, tab backward
            if (event.shiftKey) {
                nextFocusableElementIndex--;
            } else {
                nextFocusableElementIndex++;
            }
            // loop through focusable elements
            if (nextFocusableElementIndex <= -1) {
                nextFocusableElementIndex = focusableElements.length - 1;
            } else if (nextFocusableElementIndex >= focusableElements.length) {
                nextFocusableElementIndex = 0;
            }
        }
        nextFocusableElement = focusableElements[nextFocusableElementIndex];
        // reset latest elements cursors after having looked for the next element to focus
        if (focusableModalElements.length === 0) {
            latestFocusedElementBeforeModal = null;
        }
        latestFocusedElement = null;
        latestEnteredElement = null;
        // if found, focus on the next focusable element
        if (nextFocusableElement) {
            event.preventDefault();
            event.stopImmediatePropagation();
            nextFocusableElement.focus();
            return false;
        }
        return true;
    }

    function handleKeyDownEnterEvent(event) {
        const element = event.target;
        const elementTag = element.tagName.toLowerCase();
        if (element === document.activeElement) {
            if (elementTag === 'a' || elementTag === 'button') {
                // autoblur buttons on enter
                setTimeout(function () {
                    element.blur();
                }, 10);
            } else if (elementTag === 'input' && event.target.type === 'checkbox') {
                // toggle checkbox checked state
                element.checked = !element.checked;
                // manually dispatch the change event
                const changeEvent = new Event('change', { bubbles: true });
                element.dispatchEvent(changeEvent);
            }
            latestEnteredElement = element;
        }
    }

    function isZero(value) {
        return parseInt(value, 10) === 0;
    }

    function isElementWindowOrDocument(element) {
        return element === window || element === document;
    }

    function isElementAccessible(element) {
        if (
            element.hasAttribute('disabled') ||
            element.classList.contains('disabled') ||
            element.classList.contains('hidden')
        ) {
            return false;
        }
        const style = window.getComputedStyle(element);
        if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.opacity === '0' ||
            style.pointerEvents === 'none' ||
            isZero(style.width) ||
            isZero(style.maxWidth) ||
            isZero(style.height) ||
            isZero(style.maxHeight)
        ) {
            return false;
        }
        return true;
    }

    function isElementFocusable(element) {
        do {
            if (!isElementAccessible(element)) {
                return false;
            }
            element = element.parentElement;
        } while (element);
        return true;
    }

    function getFocusableElementsBySelector(root, selector) {
        const elements = Array.from(root.querySelectorAll(selector));
        return elements.filter(function (element) {
            return isElementFocusable(element);
        });
    }

    function getFocusableElements(parent) {
        parent = parent || document;
        const selectors = [
            'a',
            'button',
            'input',
            'select',
            'summary',
            'textarea',
            '[tabindex]',
        ];
        const selector = selectors.join(':not([tabindex="-1"]), ');
        const elements = getFocusableElementsBySelector(parent, selector);
        return elements;
    }

    function getFocusableElementsSortedByTabindex(parent) {
        const elements = getFocusableElements(parent);
        // let's honor default tabindex behaviour
        elements.sort(function (a, b) {
            const aTabIndex = parseInt(a.getAttribute('tabindex')) || 0;
            const bTabIndex = parseInt(b.getAttribute('tabindex')) || 0;
            return aTabIndex - bTabIndex;
        });
        return elements;
    }

    function getFocusableModalElements() {
        const selector = '[aria-modal="true"]';
        const elements = getFocusableElementsBySelector(document, selector);
        return elements;
    }

    function getFocusableModalElementsSortedByZIndex() {
        const elements = getFocusableModalElements();
        return elements;
    }

    window.tabbo = tabbo;
})();
