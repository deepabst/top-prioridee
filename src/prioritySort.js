// challenge the user with the same comparison we are going to send to the function later..
function challengeUser(arr) {
    const comparison = arr[selectMiddleElement(arr)]
    console.log(`Is your new task more important than: ${comparison} ?`)
}

// returns the middle element,
// for even-lengthed arrays
// the first element of the second half is returned
function selectMiddleElement(arr) {
    const halvedIndex = Math.floor(arr.length / 2);
    return halvedIndex;
}

let listInProgress = ['A'];
// let listInProgress = ['A', 'C', 'F', 'G', 'S', 'Z'];
// let listInProgress = ['A', 'C', 'F', 'G', 'S', 'Z', 'a', 'b', 'c'];
let indexOffset = 0; // global state to record cumulative number of elements cut off the front of the original data when halving each time. Allows the new task to be inserted at the user selected index.

// sortStuff takes an array of items - updates global state to reflect the users choices
function sortStuff(arr, isMoreImportant) {
    console.log("--------------");
    const halvedIndex = selectMiddleElement(arr);
    const comparison = arr[halvedIndex];
    console.log(`Is the new task more important than: '${comparison}' ?`);
    // is this task more important than the comparison task
    if (isMoreImportant) {
        listInProgress = arr.slice(halvedIndex + 1);
        if (listInProgress.length === 0) {
            console.log('more important base case reached')
            const newItemIndex = indexOffset + halvedIndex + 1;
            console.log({ newItemIndex });
        }
        indexOffset += halvedIndex + 1;
    } else {
        listInProgress = arr.slice(0, halvedIndex);
        if (listInProgress.length === 0) {
            console.log('less important base case reached')
            const newItemIndex = indexOffset + halvedIndex;
            console.log({ newItemIndex });
        }
        indexOffset += 0;
    }
    console.log({ listInProgress });
    console.log({ indexOffset });


    //TODO: check if base case reached (i.e nothing left to compare to)
}
// sortStuff(listInProgress, false);

// test case 1: user ALWAYS says the new task is MORE important
// console.log(`expected newItemIndex = 6`);
// sortStuff(listInProgress, true);
// sortStuff(listInProgress, true);

// test case 2: user ALWAYS says the new task is LESS important
// console.log(`expected newItemIndex = 0`);
// sortStuff(listInProgress, false);
// sortStuff(listInProgress, false);
// sortStuff(listInProgress, false); // third round of questioning required

// test case 3: user says the new task is MORE, LESS then, LESS important
// console.log(`expected newItemIndex = 4`)
// sortStuff(listInProgress, true);
// sortStuff(listInProgress, false);
// sortStuff(listInProgress, false);

// test case 4: user says the new task is new task is second least important (i.e. in between A and C)
// expected newItemIndex = 1
// sortStuff(listInProgress, false);
// sortStuff(listInProgress, false);
// sortStuff(listInProgress, true);



// use case 5: change length of array - uncomment longer array
// sortStuff(listInProgress, false);
// sortStuff(listInProgress, false);
// sortStuff(listInProgress, true);
// sortStuff(listInProgress, true);


// sorting algorithm
//
// read each task object for importance and write that into the sortedTasks list
// show the user the unsorted task and the middle importance task
// ask user: true or false? 
// "taskA is more important than taskB"
// wait for user input
// user chooses true?
// discard all less important tasks
// user chooses false?
// discard all more important tasks
// repeat with halved list 
// stop when user has answered against a single question
// splice into original array at the user chosen element
// write the importance back to the main state object from the sorted list
//
// prior artwork
//
// const arr = ['a', 'b', 'd'];
// let start = 2;
// let deleteCount = 0;
// arr.splice(start, deleteCount, 'c');

// arr; // ['a', 'b', 'c', 'd'];

// TODO: how can we wait for user input?
// TODO: WHW the user doesn't complete the full sorting question run? or cancels the dialog?

//TODO: When base case reached - splice in new task to array at that point