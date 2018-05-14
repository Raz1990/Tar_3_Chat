//element = ul
function ChatTree(element) {
    //items = array of JSON elements
    //type (user, group), name and items (if group, array of JSON elements)
    function load(items) {
        //make key press
        document.body.addEventListener('keydown', (event) => {
            decideAction(event);
        });

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
        //if nothing is active, simply go back
        if (!currentlyActive) {
            return;
        }

        let liChildren, liParent;

        //check if its a group
        if (currentlyActive.classList.contains('group')) {
            //get its children
            liChildren = getElementChildren(currentlyActive);
        }
        //if it's a child of another element, get the parent
        if (currentlyActive.classList.contains('childElement')) {
            liParent = getElementParent(currentlyActive);
        }

        if (event.key === 'ArrowDown') {
            let eleToActive, idNow;

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

        else if (event.key === 'ArrowUp') {
            let eleToActive, idNow;

            idNow = parseInt(currentlyActive.id);

            if (idNow === 1) {
                return;
            }

            //if has a parent
            if (liParent) {
                let parentsChildren = getElementChildren(liParent);
                let lastChild = parentsChildren[parentsChildren.length - 1];
                idNow = parseInt(liParent.id);
                eleToActive = document.getElementById(idNow);
            }
            else {
                let groupElements = document.getElementsByClassName("group");
                let lastGroupChildren = getElementChildren(groupElements[groupElements.length - 1]);
                if (areElementsHidden(lastGroupChildren)) {

                }
                eleToActive = document.getElementById(idNow - 1);
            }

            //if (liChildren && !areElementsHidden(liChildren)) {
            //    eleToActive = liChildren[0];
            //}
            //else {
            //    let idNow;
            //    if (liParent) {
            //        idNow = parseInt(liParent.id);
            //    }
            //    else {
            //        idNow = parseInt(currentlyActive.id);
            //    }
            //    eleToActive = document.getElementById((idNow + 1));
            //}

            makeActive(eleToActive);
        }

        else if (event.key === 'ArrowRight') {
            //if it has children
            if (liChildren) {
                //if any of my children are hidden, i will hide myself
                if (areElementsHidden(liChildren)) {
                    decideVisibilty(currentlyActive);
                }
                makeActive(liChildren[0]);
            }
        }

        else if (event.key === 'ArrowLeft') {

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
    }

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
    }

    return {
        load,
        clear,
        element,
    };
}
