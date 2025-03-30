console.log("fail ühendatud");

class Entry {
    constructor(title, description, date) {
        this.title = title;
        this.description = description;
        this.date = date;
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

    addEntry() {
        console.log("vajutasin nuppu");
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue));
        console.log(this.entries);
        this.save();
   }

    render() {
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


        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
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

                //ChatGPT "Kuidas kõigepealt eemaldada vana sisu enne uue lisamist innerHTML abil?"
                li.innerHTML = '';
                li.appendChild(titleInput);
                li.appendChild(descriptionInput);
                li.appendChild(dateInput);
            
                const okButton = document.createElement("button");
                okButton.innerText = "OK";
                okButton.className = "OK";
                //ChatGPT "kas on võimalik teha event listener event listeneri sees ja näidet selle kohta"
                function handleOkButton() {
                    this.entries[entryIndex].title = titleInput.value;
                    this.entries[entryIndex].description = descriptionInput.value;
                    this.entries[entryIndex].date = dateInput.value;
                    this.save();
                };

                okButton.removeEventListener("click", handleOkButton); 
                //bind() kasutamine https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
                okButton.addEventListener("click", handleOkButton.bind(this));
                li.appendChild(okButton);
            });

            div.className = "task";

            div.innerHTML = `<div> ${entryValue.title}</div><div>${entryValue.description}</div><div>${this.formatDate(entryValue.date)}</div>`;
            
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