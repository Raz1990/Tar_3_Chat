//element = ul
function ChatTree(element) {
    //items = array of JSON elements
    //type (user, group), name and items (if group, array of JSON elements)
    function load(items) {
        //make key press
        document.body.addEventListener('keydown', (event)=>{
            decideAction(event, items);
        });

        innerLoad(items);
    }

    function innerLoad(items,childElement,parentLiClassName,repeatSpaces) {
        childElement = childElement || false;

        parentLiClassName = parentLiClassName || "";

        repeatSpaces = repeatSpaces || 0;

        for (let item of items) {
            let li = document.createElement("li");
            li.innerHTML = '&nbsp'.repeat(repeatSpaces) + item.name;
            li.className += item.type+' '+item.name.replace(' ', '_')+' ';
            element.appendChild(li);

            li.addEventListener('click', ()=>{
                makeActive(li);
            });

            li.addEventListener('dblclick', ()=>{
                decideVisibilty(item.items);
            });

            if (childElement) {
                li.className += 'childElement isHidden childOf_'+parentLiClassName+' ';
            }
            //if it's a group with items in it
            if (item.items) {
                innerLoad(item.items, true, item.name.replace(' ', '_'),repeatSpaces+3);
            }
        }
    }

    function decideAction(event, items) {
        const currentlyActive = document.getElementsByClassName('active')[0];
        //if nothing is active, simply go back
        if (!currentlyActive) {
            return;
        }

        //otherwise, decide whether the active li is a group with children
        let isGroup;

        if (currentlyActive.classList.contains('group')){
            isGroup = true;
        }
        else {
            isGroup = false;
        }

        //if parent, get its children
        if (isGroup){

        }

        if (event.key === 'ArrowDown') {
            if (isGroup){
                //FIX
                let item = items.find((item)=>{
                    return item.name.replace(' ', '_') === currentlyActive.classList[1];
                });
                decideVisibilty(item.items);
            }
            alert(event.key);
        }
        else if (event.key === 'ArrowRight') {
            alert(event.key);
        }

        else if (event.key === 'ArrowUp') {
            alert(event.key);
        }
        else if (event.key === 'ArrowLeft') {
            alert(event.key);
        }
    }

    function getChildren(className) {
        let parent = document.getElementsByClassName(className);
    }

    function makeActive(li) {
        //remove active status from any previous active
        let currentlyActive = document.getElementsByClassName('active');
        if (currentlyActive.length > 0){
            currentlyActive[0].classList.toggle('active');
        }
        //add the active status to the selected li
        li.classList.toggle('active');
    }

    function decideVisibilty(items,parentElement) {

        if (!items) {
            return;
        }

        parentElement = parentElement || null;

        for (let item of items) {
            let elements = document.getElementsByClassName(item.name.replace(' ', '_'));
            for (let ele of elements) {

                ele.classList.toggle('isHidden');

                if (parentElement) {
                    if (parentElement.classList.contains('isHidden')) {
                        ele.classList.add('isHidden');
                    }
                }
                if (ele.classList.contains('isHidden') && item.items) {
                    decideVisibilty(item.items, ele);
                }
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
