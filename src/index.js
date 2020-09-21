class List {
    tasks = [];
    baseUrl;
    token;

    constructor (baseUrl) {
        this.baseUrl = baseUrl;        
    }
    
    authorize(userMail) {
        fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                value: userMail
            })
        })
        .then(response => response.json())
        .then(({access_token}) => {
            this.token = access_token;
            this.getAlltasks();
        })
        .catch(( {message} ) => console.log(message))
    }

    getAlltasks() {
        fetch(`${this.baseUrl}/todo`, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${this.token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            this.tasks = data; 
        })
        .catch(( {message} ) => console.log(message))
    }

    addTask(value, priority) {
        if(this.findDublicate(value)) {
        if (value.trim() && priority) {
            fetch(`${this.baseUrl}/todo`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,    
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value,
                    priority
            })
        })
        .then(response => response.json())
        .then(task => this.tasks.unshift(task))
        .catch(( {message} ) => console.log(message))
        }
        } else {
            throw new Error('This task already exists');
        }
    }

    deleteTask(id) {
        fetch(`${this.baseUrl}/todo/${id}`, {
            method: 'DELETE',
            headers: {
            Authorization: `Bearer ${this.token}`,    
            }            
        })
        .then(response => {
            if(response.status === 200) {
                const index = this.tasks.findIndex(({_id}) => id === _id);
                if (index !== -1) {
                    this.tasks.splice(index, 1);
                }
            }
        })
        .catch(( {message} ) => console.log(message))
    }

    
    toggleCompletion(id) {
        fetch(`${this.baseUrl}/todo/${id}/toggle`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.token}`,    
                }            
        })
        .then(response => response.json())
        .then(task => this.replaceTask(task))
        .catch(( {message} ) => console.log(message))
    }

    
    findDublicate(value) {
        let newTask = this.tasks.find(function(task) {
            return task.value === value;
        });
        if (newTask === undefined) {
            return true;
        } else {
            return false;
        };
    }

    replaceTask(task) {
        const index = this.tasks.findIndex(({_id}) => _id ===task._id);
        if (index !== -1) {
                this.tasks.splice(index, 1, task);
        }     
    }
}


class TodoInterface {
    constructor(containerEl, todo, userMail, listName) {
        this.form = this.fillForm();
        this.list = this.createList()
        this.listNAme = listName;
        this.listName = document.createElement('h1');
        this.listName.textContent = listName;
        
        this.userMail = userMail;
        
        containerEl.prepend(this.list);
        containerEl.prepend(this.form);
        containerEl.prepend(this.listName);


        this.todo = todo;
        this.todo.authorize(userMail);
    }

    fillForm() {
        const form = document.querySelector('form');
        const input = document.querySelector('input');
        
        form.addEventListener('submit', e => {
            e.preventDefault();
            this.todo.addTask(input.value, 1);
            this.processTasks();
            form.reset();
        })
        return form;
    }
    
    createList() {
        const ul = document.createElement('ul');
        return ul;
    }

    processTasks() {
        this.list.innerHTML = '';
        
        this.todo.tasks.forEach(task => {
            const $li = document.createElement('li');
            $li.innerHTML = `<span>${task.value}</span>
            <button type = 'button'>Delete</button>
            <button type = 'button' class = 'done-button'>Done</button>
            `;
            
            $li.querySelector('button')
            .addEventListener('click', e => {
                e.target.parentElement.remove();
                    if($li.querySelector('span').textContent === task.value) {
                    this.todo.deleteTask(task._id);
                    }
            });
            
            this.list.append($li);
            
            $li.querySelector('.done-button')
            .addEventListener('click', e => {
                $li.classList.toggle('done');
                    if ($li.querySelector('span').textContent === task.value) {
                    this.todo.toggleCompletion(task._id);
                    }
            });

            const hideButton = document.querySelector('.hide-button');
            hideButton.addEventListener('click', e => {
                if ($li.className ==='done') {
                $li.classList.add('hidden');
               } else {
                $li.classList.remove('hidden');
               } 
            });
            
        
        });
            
        return this.list;
    }
}


let todo = new TodoInterface(document.querySelector('body'), new List('https://todo.hillel.it'), 'thoronion@gmail.com', 'My New Todolist');

