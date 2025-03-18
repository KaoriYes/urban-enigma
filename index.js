//  https://byrayray.dev/posts/2022-01-19-how-to-validate-bsn-pgn-and-own-in-the-netherlands-with-typescript-javascript
function elfProefValidation(value, type) {
    let returnValue = false
    if (!value || value?.length === 0) {
        return true
    }
    if (value === '00000000000' || value.length !== 9) {
        return false
    }
    const values = value.split('')
    const firstCharacter = parseInt(values[0], 10)
    const lastCharacter = parseInt(values[values.length - 1], 10)
    const [a, b, c, d, e, f, g, h, i] = values.map(char => parseInt(char, 10))
    let result = 0

    if (type === 'bsn') {
        result = 9 * a + 8 * b + 7 * c + 6 * d + 5 * e + 4 * f + 3 * g + 2 * h + -1 * i
        returnValue = result > 0 && result % 11 === 0
    } else if (type === 'own') {
        result = 9 * a + 8 * b + 7 * c + 6 * d + 5 * e + 4 * f + 3 * g + 2 * h
        returnValue = result > 0 && firstCharacter === 1 && result % 11 === lastCharacter + 5
    } else {
        returnValue = false
    }

    return returnValue
}

// bsn validation
let bsnChecker = document.querySelector('#bsn');

bsnChecker.addEventListener('keypress', (event) => {
    if (elfProefValidation(bsnChecker.value, 'bsn')) {
        bsnChecker.setCustomValidity('')
    } else {
        bsnChecker.setCustomValidity('Dit is geen correct BSN nummer')


    }
    bsnChecker.reportValidity();
    return true;
});


bsnChecker.addEventListener('change', (event) => {
    if (elfProefValidation(bsnChecker.value, 'bsn')) {
        bsnChecker.setCustomValidity('')
    } else {
        bsnChecker.setCustomValidity('Dit is geen correct BSN nummer')


    }
    bsnChecker.reportValidity();
    return true;
});


// indexed db
let db;
const dbName = "FormDB";
const storeName = "FormData";

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {keyPath: "name"});
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject("IndexedDB error: " + event.target.errorCode);
        };
    });
};

const saveData = async (name, value) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    store.put({name, value});

    // transaction.oncomplete = () => console.log(`Saved: ${name} = ${value}`);
};

const loadData = async () => {
    const db = await openDB();
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();


    request.onsuccess = () => {
        console.log(request.result);
        const data = request.result;
        data.forEach(({name, value}) => {
            const input = document.querySelector(`[name="${name}"]`);

            if (!input) return;

            if (Array.isArray(value)) {
                // Checkboxes (set checked state)
                value.forEach(val => {
                    const checkbox = document.querySelector(`[name="${name}"][value="${val}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else if (input.type === "radio") {
                // Radio button (set selected value)
                const radio = document.querySelector(`[name="${name}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else if (input.type === "checkbox") {
                // Single checkbox (set checked state)
                input.checked = value === true;
            } else {
                // Text, email, textarea
                input.value = value;
            }

        });

    };
};
const loadSpecificData = async (name) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    let specificData = name;
    request.onsuccess = () => {
        console.log(request.result);
        const data = request.result;
        let item = data.filter((data) => data.name === specificData);

        item.forEach(({name, value}) => {
            const input = document.querySelector(`[name="${name}"]`);
            if (!input) return;
            input.value = value;
        })
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    handleStartChange(fieldsetJsLogic);
    document.querySelectorAll("form fieldset fieldset label input, form fieldset fieldset label select").forEach(input => {
        input.addEventListener("change", (event) => {
            const {name, type, value, checked} = event.target;
            if (type === "radio" && checked) {
                saveData(name, value);
            } else if (type === "checkbox") {
                if (event.target.form.querySelectorAll(`[name="${name}"]`).length > 1) {
                    // Multiple checkboxes with the same name (store as array)
                    const checkedValues = Array.from(
                        event.target.form.querySelectorAll(`[name="${name}"]:checked`)
                    ).map(cb => cb.value);

                    saveData(name, checkedValues);
                } else {
                    // Single checkbox (store as true/false)
                    saveData(name, checked);
                }
            } else {
                saveData(name, value);
            }
        });
    });
});


//q12g
const Q12g = document.querySelector("#q12g");
Q12g.querySelector('span.remove-JS').style.display = 'none';
Q12g.querySelector('p.remove-JS').style.display = 'none';

// const fieldsetJsLogic = ['q12f', 'q12g', 'q12k', 'q12n'];

const fieldsetJsLogic = ['q12f', 'q12g', 'q12gAdd'];

function handleStartChange(fieldsetJsLogic) {
    fieldsetJsLogic.forEach(field => {
        let fieldset = document.querySelector(`#${field}`);
        if (fieldset) {
            if (field === 'q12g' || field === 'q12gAdd') {
                handleQ12g(fieldset);
            } else if (['q12f', 'q12k', 'q12n'].includes(field)) {
                handleReactionQuestion(fieldset);
            }
        }
    });
}


function handleReactionQuestion(fieldset) {
    let followUps = fieldset.querySelectorAll('.followUpQuestion');
    followUps.forEach(followUp => {
        followUp.style.display = "none";
    })
    let inputs = fieldset.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', (event) => {
            followUps.forEach(followUp => {
                if (input.value === 'yes' && input.checked === true) {
                    followUp.style.display = "block";
                    followUp.querySelector('input').required = true;
                    followUp.querySelector('label').classList.add('required');
                } else {
                    followUp.style.display = "none";
                }
            })
        })
    })


}


function handleQ12g(fieldset) {
    const buildingInputs = fieldset.querySelectorAll('.followUpQuestion');
    buildingInputs.forEach(input => {
        input.style.display = "none";
    })

    const radioButtons = fieldset.querySelectorAll('input[type="radio"]');
    if (radioButtons.value === 'yes' && radioButtons.checked) {
        createDynamicInput(fieldset);
    }
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {

            if (radio.value === 'yes' && radio.checked) {
                createDynamicInput(fieldset);


            } else {
                removeDynamicInput(fieldset);

                // console.log(fieldset.nextElementSibling, fieldset.nextElementSibling.nextElementSibling, fieldset.nextElementSibling.nextElementSibling.nextElementSibling);
                // fieldset.nextElementSibling.style.display = "none";
                // fieldset.nextElementSibling.nextElementSibling.style.display = "none";
                // fieldset.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none";
            }
        });
    });
}

function createDynamicInput(fieldset, buildingInputs) {
    if (!fieldset.querySelector('.dynamic-input')) {

        const newInputContainer = document.createElement('div');
        newInputContainer.classList.add('dynamic-input');
        const label = document.createElement('label');
        label.classList.add('input-non-radio', 'required', 'BuildingChoice');
        const span = document.createElement('span');
        span.innerHTML = 'In welk land staat het ter beschikking gestelde pand?';
        label.appendChild(span);
        const select = document.createElement('select');
        select.required = true;

        select.name = 'locatiePand';

        select.classList.add('big-mobile');
        const options = [
            {value: 'NL', text: 'Nederland'},
            {value: 'GLB', text: 'Buitenland'},
            {value: 'unknown', text: 'Geen adres bekend'}
        ];
        options.forEach(optData => {
            const option = document.createElement('option');
            option.value = optData.value;
            option.innerHTML = optData.text;
            select.appendChild(option);
        });
        label.appendChild(select);
        newInputContainer.appendChild(label);
        const radioContainer = fieldset.querySelector('.followUpQuestion');
        fieldset.insertBefore(newInputContainer, radioContainer);
        loadSpecificData(select.name);
        addFieldsetBuildings12g(fieldset, select);


        select.addEventListener('change', () => {
            addFieldsetBuildings12g(fieldset, select);
            saveData(select.name, select.value);
        });
    }
}

function addFieldsetBuildings12g(fieldset, select) {
    let buildingInputs = fieldset.querySelectorAll('.followUpQuestion');
    checkBuildingsInputs(buildingInputs, select);
    if (buildingInputs.length === 0) {
        const dupeBuildings = Array.from(document.querySelectorAll('.big-address-fieldset'));
        dupeBuildings.forEach(buildingInput => {
            buildingInput.cloneNode(true)
            fieldset.appendChild(buildingInput);
        })
        let buildingInputs = fieldset.querySelectorAll('.followUpQuestion');
        checkBuildingsInputs(buildingInputs, select)

    }
}

function removeDynamicInput(fieldset) {
    const dynamicInput = fieldset.querySelector('.dynamic-input');
    if (dynamicInput) {
        dynamicInput.remove();
    }
    let buildingInputs = fieldset.querySelectorAll('.followUpQuestion');
    buildingInputs.forEach(buildingInput => {
        buildingInput.style.display = "none";
    })
}


function checkBuildingsInputs(buildingsInput, select) {
    buildingsInput.forEach(building => {
        if (building.classList.contains(select.value)) {
            building.style.display = "block";
            building.classList.add('single-question-required');
            building.querySelectorAll('input').forEach(input => {
                if (!input.getAttribute('not-required')) {
                    input.required = true;
                }
            })
        } else {
            building.style.display = "none";
        }
    })
}
