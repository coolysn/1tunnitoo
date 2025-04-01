console.log("fail ühendatud");

class Entry {
    constructor(title, description, date, priority) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.done = false;
    }
}

class Todo {
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.render();
        document.querySelector("#addButton").addEventListener("click", () => {this.addEntry()});
    }

    formatDate(dateString){
        if(!dateString) return ""; //ChatGPT "Kuidas kontrollida, kas muutuja dateString on tühi või määramata"
        //Idee tuli siit - https://stackoverflow.com/questions/72250220/how-to-split-date-strings-in-javascript-array
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    }

    sortEntries(){
        const priorityOrder = {"1": 1, "2": 2, "3": 3};
        this.entries.sort((a, b) => {
            const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityComparison !== 0) {
                return priorityComparison; 
            }
           return new Date(a.date) - new Date(b.date); //Idee tuli siit - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        });   
    }

    addEntry() {
        console.log("vajutasin nuppu");
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;
        const priorityValue = document.querySelector("#priority").value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue, priorityValue));

        this.sortEntries();

        console.log(this.entries);
        this.save();
   }

    render() {
        this.sortEntries();
        let tasklist = document.querySelector("#taskList");
        tasklist.innerHTML = "";

        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";

        const priorityMapping = { "1": "1 - High", "2": "2 - Medium", "3": "3 - Low" };

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            li.classList.add(`priority-${entryValue.priority}`);
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            editButton.innerText ="edit";
            editButton.className = "edit";
            doneButton.innerText = "✓";
            deleteButton.innerText = "X";
            deleteButton.className = "delete";
            doneButton.className = "done";

            deleteButton.addEventListener("click", () => {
                this.entries.splice(entryIndex, 1);
                this.save();
                
            });

            doneButton.addEventListener("click", () => {
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done = false;
                } else{
                    this.entries[entryIndex].done = true;
                }
                
                this.save();
            });

            editButton.addEventListener("click", () => {
                const currentTitle = this.entries[entryIndex].title;
                const currentDescription = this.entries[entryIndex].description;
                const currentPriority = this.entries[entryIndex].priority;
                const currentDate = this.entries[entryIndex].date;

                const titleInput = document.createElement("input");
                titleInput.type = "text";
                titleInput.value = currentTitle;

                const descriptionInput = document.createElement("input");
                descriptionInput.type = "text";
                descriptionInput.value = currentDescription;

                const dateInput = document.createElement("input");
                dateInput.type = "date";
                dateInput.value = currentDate;

                //ChatGPT - "Editimisel kuvatakse prioriteet õigesti kui '1 - High',  kuid uue ülesande lisamisel salvestatakse see ainult numbrina. Kuidas tagada, et prioriteet  sisaldaks numbrit ja teksti?"
                const prioritySelect = document.createElement("select");
                Object.entries(priorityMapping).forEach(([key, value]) => {
                const option = document.createElement("option");
                option.value = key; // Salvestatakse numbrina
                option.textContent = value; // Kuvatakse teksti
                if (key === currentPriority) option.selected = true;
                prioritySelect.appendChild(option);
            });

                //ChatGPT "Kuidas kõigepealt eemaldada vana sisu enne uue lisamist innerHTML abil, kas see on vale kasutada kui nt sisu ei muudeta?"
                li.innerHTML = '';
                li.appendChild(titleInput);
                li.appendChild(descriptionInput);
                li.appendChild(prioritySelect);
                li.appendChild(dateInput);
            
                const okButton = document.createElement("button");
                okButton.innerText = "OK";
                okButton.className = "OK";
                //ChatGPT "kas on võimalik teha event listener event listeneri sees ja näidet selle kohta"
                function handleOkButton() {
                    this.entries[entryIndex].title = titleInput.value;
                    this.entries[entryIndex].description = descriptionInput.value;
                    this.entries[entryIndex].date = dateInput.value;
                    this.entries[entryIndex].priority = prioritySelect.value;
                    this.save();
                };

                okButton.removeEventListener("click", handleOkButton); 
                //bind() kasutamine https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
                okButton.addEventListener("click", handleOkButton.bind(this));
                li.appendChild(okButton);
            });

            div.className = "task";

            const priorityIcons = {
                "1": "🔴 High",
                "2": "🟠 Medium",
                "3": "🟢 Low"
            };
            
            div.innerHTML = `<div class="task-title">${entryValue.title}</div>
                 <div class= "task-description">${entryValue.description}</div>
                 <div>${this.formatDate(entryValue.date)}</div>
                 <div class="priority-badge priority-${entryValue.priority}">
                     ${priorityIcons[priorityMapping[entryValue.priority]] || ""} 
                     ${priorityMapping[entryValue.priority] || entryValue.priority}
                 </div>`;

            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else{
                ul.appendChild(li);
            }

            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
        });

        tasklist.appendChild(taskHeading)
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
        
    }

    save() {
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
};

const todo = new Todo();
