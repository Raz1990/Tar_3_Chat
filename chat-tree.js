//element = ul
function ChatTree(element) {
    //items = array of JSON elements
    //type (user, group), name and items (if group, array of JSON elements)
    function load(items) {

        clear();

        //make key press event
        document.body.addEventListener('keyup', decideAction);

        innerLoad(items);
    }

    let lastItemId;

    function innerLoad(items, childElement, parentLiClassName, repeatSpaces, idValue) {
        childElement = childElement || false;

        parentLiClassName = parentLiClassName || "";

        repeatSpaces = repeatSpaces || 0;

        idValue = idValue || 1;

        for (let item of items) {
            const itemNameForClass = item.name.replace(' ', '_');
            let li = document.createElement("li");
            li.innerHTML = '&nbsp'.repeat(repeatSpaces) + item.name;
            li.className += item.type + ' ' + itemNameForClass + ' ';
            li.id = idValue;
            element.appendChild(li);

            li.addEventListener('click', () => {
                makeActive(li);
            });

            li.addEventListener('dblclick', () => {
                decideVisibilty(li);
            });

            if (childElement) {
                li.className += 'childElement childOf_' + parentLiClassName + ' isHidden ';
            }
            //if it's a group with items in it
            if (item.items) {
                innerLoad(item.items, true, itemNameForClass, repeatSpaces + 3, items.length + idValue);
            }
            lastItemId = idValue;
            idValue++;
        }
    }

    function decideAction(event) {
        const currentlyActive = document.getElementsByClassName('active')[0];
        let liChildren, liParent;
        if (currentlyActive) {
            liChildren = getElementChildren(currentlyActive);
            liParent = getElementParent(currentlyActive);
        }

        switch (event.key) {
            case 'ArrowDown':
                dealWithDown(currentlyActive,liChildren,liParent);
                break;
            case 'ArrowUp':
                dealWithUp(currentlyActive);
                break;
            case 'Enter':
                dealWithEnter(currentlyActive, liChildren);
                break;
            case 'ArrowRight':
                dealWithRight(currentlyActive, liChildren);
                break;
            case 'ArrowLeft':
                dealWithLeft(currentlyActive, liChildren, liParent);
                break;
        }
    }

    function dealWithDown(currentlyActive, liChildren, liParent) {
        ///FEATURE
        //Check if there is a li to active if none are active
        const firstLi = document.getElementsByTagName('li')[0];
        if (!currentlyActive && firstLi){
            makeActive(firstLi);
        }

        //if nothing is active, and no li in sight, simply go back
        if (!currentlyActive) {
            return;
        }

        let eleToActive, idNow;

        //check if its a group
        if (currentlyActive.classList.contains('group')) {
            //get its children
            liChildren = getElementChildren(currentlyActive);
        }
        //if it's a child of another element, get the parent
        if (currentlyActive.classList.contains('childElement')) {
            liParent = getElementParent(currentlyActive);
        }

        idNow = parseInt(currentlyActive.id);

        if (idNow === lastItemId) {
            return;
        }

        //if has children and
        //those children are visible and can be moved to
        if (liChildren && !areElementsHidden(liChildren)) {
            eleToActive = liChildren[0];
        }
        else {
            if (liParent) {
                let parentsChildren = getElementChildren(liParent);
                let lastChild = parentsChildren[parentsChildren.length - 1];
                //if i'm the last active child
                if (parseInt(lastChild.id) === idNow) {
                    //take my parent's id
                    idNow = parseInt(liParent.id);
                }
            }
            eleToActive = document.getElementById(idNow + 1);
        }

        makeActive(eleToActive);
    }

    function dealWithUp(currentlyActive) {
        let eleToActive, idNow, previousLi;

        idNow = parseInt(currentlyActive.id);

        if (idNow === 1) {
            return;
        }

        previousLi = currentlyActive.previousSibling;

        do {
            eleToActive = previousLi;
            if (eleToActive.classList.contains('isHidden')) {
                previousLi = previousLi.previousSibling;
            }
        }while (eleToActive.classList.contains('isHidden'));

        makeActive(eleToActive);
    }

    function dealWithLeft(currentlyActive, liChildren, liParent) {

        if (liChildren) {
            if (!areElementsHidden(liChildren)) {
                decideVisibilty(currentlyActive);
            }
            else if (liParent) {
                if (areElementsHidden(getElementChildren(liParent))) {
                    decideVisibilty(liParent);
                }
                makeActive(liParent);
            }
        }
        else if (liParent) {
            if (areElementsHidden(getElementChildren(liParent))) {
                decideVisibilty(liParent);
            }
            else {
                makeActive(liParent);
            }
        }
    }

    function dealWithRight(currentlyActive, liChildren) {
        //if it has children
        if (liChildren.length > 0) {
            //if any of my children are hidden, i will hide myself
            if (areElementsHidden(liChildren)) {
                decideVisibilty(currentlyActive);
            }
            //makeActive(liChildren[0]);
        }
    }

    function dealWithEnter(currentlyActive, liChildren) {
        //if it has children
        if (liChildren.length > 0) {
            decideVisibilty(currentlyActive);
        }
    }

    //helper functions

    function getElementParent(element) {
        //classList[3] = childOf_*** (parent group)
        //substring(8) = just the ***
        if (element.classList[3]) {
            const className = element.classList[3].substring(8);
            const parent = document.getElementsByClassName(className)[0];
            return parent;
        }
        return null;
    }

    function getElementChildren(element) {
        const className = element.classList[1];
        const children = document.getElementsByClassName('childOf_' + className);
        return children;
    }

    //gets an element and gives it the "active" class
    function makeActive(element) {
        //remove active status from any previous active
        let currentlyActive = document.getElementsByClassName('active');
        if (currentlyActive.length > 0) {
            currentlyActive[0].classList.toggle('active');
        }
        //add the active status to the selected element
        element.classList.toggle('active');
    }

    //gets an array of elements, and returns true if one of them has isHidden class
    function areElementsHidden(childrenArray) {
        for (const child of childrenArray) {
            if (!child.classList.contains('isHidden')) {
                return false;
            }
        }
        return true;
    }

    function decideVisibilty(element) {
        eleChildren = getElementChildren(element);
        eleParent = getElementParent(element);
        if (!eleChildren) {
            return;
        }

        for (let child of eleChildren) {
            child.classList.toggle('isHidden');
            child.classList.toggle('isShown');
            const innerChildHidden = areElementsHidden(getElementChildren(child));
            if (child.classList.contains('isHidden') && !innerChildHidden) {
                decideVisibilty(child);
            }
        }
    }

    function clear() {
        element.innerHTML = '';

        //clear key press event
        document.body.removeEventListener('keyup',decideAction);
    }

    return {
        load,
        clear,
        element,
    };
}
