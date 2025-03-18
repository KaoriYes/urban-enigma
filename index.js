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

    transaction.oncomplete = () => console.log(`Saved: ${name} = ${value}`);
};

const loadData = async () => {
    const db = await openDB();
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
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

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    document.querySelectorAll("form fieldset fieldset label input, form fieldset fieldset label textarea").forEach(input => {
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



