const form = document.querySelector('#expense-form');
const amountInput = document.querySelector('#expense-amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const button = document.querySelector('#btn');
const list = document.querySelector('#expense-list');

form.addEventListener('submit', addItem);

function addItem(event) {
    event.preventDefault();
    if (amountInput.value && descriptionInput.value && categoryInput.value) {
        const item = {
            amt: amountInput.value,
            dsp: descriptionInput.value,
            ctg: categoryInput.value
        }

        // Adding to the server
        axios.post('https://crudcrud.com/api/f12bc140bb0041159a018e3aed3b2064/expenses', item)
            .then((response) => {
                displayItem(response.data);
            })
            .catch((error) => {
                document.body.innerHTML = `<h4 id="error">Error: Something went wrong.</h4>`;
            })

        // Clearing the fields
        amountInput.value = '';
        descriptionInput.value = '';
        categoryInput.value = 'None';
    }
    else {
        alert('Please enter all the fields.');
    }
}

function displayItem(responseItem) {
    const li = `
    <li id="${responseItem._id}">
        \u20B9 ${responseItem.amt} : ${responseItem.dsp} (${responseItem.ctg})
        <div>
            <button id="delete" onClick="deleteItem('${responseItem._id}')">DELETE</button>
            <button id="edit" onClick="editItem('${responseItem._id}', '${responseItem.amt}', '${responseItem.dsp}', '${responseItem.ctg}')">EDIT</button>
        </div>
    </li>`;
    list.innerHTML += li;
}

function deleteItem(itemID) {
    axios.delete('https://crudcrud.com/api/f12bc140bb0041159a018e3aed3b2064/expenses/' + itemID)
        .then((response) => {
            removeItem(itemID);
        })
        .catch((error) => {
            document.body.innerHTML = `<h4 id="error">Error: Something went wrong.</h4>`;
        })
}

function removeItem(itemID) {
    const removeLi = document.getElementById(itemID);
    list.removeChild(removeLi);
}

/* EDIT functionality using Old method
function editItem(itemID, oldAmt, oldDsp, oldCtg) {
    amountInput.value = oldAmt;
    descriptionInput.value = oldDsp;
    categoryInput.value = oldCtg;
    deleteItem(itemID);
}
*/

// EDIT functionality using PUT method
function editItem(itemID, oldAmt, oldDsp, oldCtg) {
    axios.put('https://crudcrud.com/api/f12bc140bb0041159a018e3aed3b2064/expenses/' + itemID, {
        amt: oldAmt,
        dsp: oldDsp,
        ctg: oldCtg
    })
        .then((putRes) => {
            deleteItem(itemID);
            axios.get('https://crudcrud.com/api/f12bc140bb0041159a018e3aed3b2064/expenses/' + itemID)
                .then((getRes) => {
                    amountInput.value = getRes.data.amt;
                    descriptionInput.value = getRes.data.dsp;
                    categoryInput.value = getRes.data.ctg;
                })
                .catch((error) => {
                    document.body.innerHTML = `<h4 id="error">Error: Something went wrong.</h4>`;
                })
        })
        .catch((error) => {
            document.body.innerHTML = `<h4 id="error">Error: Something went wrong.</h4>`;
        })
}

// To prevent the list from disappearing after refresh
window.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    axios.get('https://crudcrud.com/api/f12bc140bb0041159a018e3aed3b2064/expenses')
        .then((response) => {
            response.data.forEach(element => {
                displayItem(element)
            });
        })
        .catch((error) => {
            document.body.innerHTML = `<h4 id="error">Error: Something went wrong.</h4>`;
        })
});