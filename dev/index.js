"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var List = /*#__PURE__*/function () {
  function List(baseUrl) {
    _classCallCheck(this, List);

    this.tasks = [];
    this.baseUrl = void 0;
    this.token = void 0;
    this.baseUrl = baseUrl;
  }

  _createClass(List, [{
    key: "authorize",
    value: function authorize(userMail) {
      var _this = this;

      fetch("".concat(this.baseUrl, "/auth/login"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: userMail
        })
      }).then(function (response) {
        return response.json();
      }).then(function (_ref) {
        var access_token = _ref.access_token;
        _this.token = access_token;

        _this.getAlltasks();
      })["catch"](function (_ref2) {
        var message = _ref2.message;
        return console.log(message);
      });
    }
  }, {
    key: "getAlltasks",
    value: function getAlltasks() {
      var _this2 = this;

      fetch("".concat(this.baseUrl, "/todo"), {
        method: 'GET',
        headers: {
          Authorization: "Bearer ".concat(this.token)
        }
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.tasks = data;
      })["catch"](function (_ref3) {
        var message = _ref3.message;
        return console.log(message);
      });
    }
  }, {
    key: "addTask",
    value: function addTask(value, priority) {
      var _this3 = this;

      if (this.findDublicate(value)) {
        if (value.trim() && priority) {
          fetch("".concat(this.baseUrl, "/todo"), {
            method: 'POST',
            headers: {
              Authorization: "Bearer ".concat(this.token),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              value: value,
              priority: priority
            })
          }).then(function (response) {
            return response.json();
          }).then(function (task) {
            return _this3.tasks.unshift(task);
          })["catch"](function (_ref4) {
            var message = _ref4.message;
            return console.log(message);
          });
        }
      } else {
        throw new Error('This task already exists');
      }
    }
  }, {
    key: "deleteTask",
    value: function deleteTask(id) {
      var _this4 = this;

      fetch("".concat(this.baseUrl, "/todo/").concat(id), {
        method: 'DELETE',
        headers: {
          Authorization: "Bearer ".concat(this.token)
        }
      }).then(function (response) {
        if (response.status === 200) {
          var index = _this4.tasks.findIndex(function (_ref5) {
            var _id = _ref5._id;
            return id === _id;
          });

          if (index !== -1) {
            _this4.tasks.splice(index, 1);
          }
        }
      })["catch"](function (_ref6) {
        var message = _ref6.message;
        return console.log(message);
      });
    }
  }, {
    key: "toggleCompletion",
    value: function toggleCompletion(id) {
      var _this5 = this;

      fetch("".concat(this.baseUrl, "/todo/").concat(id, "/toggle"), {
        method: 'PUT',
        headers: {
          Authorization: "Bearer ".concat(this.token)
        }
      }).then(function (response) {
        return response.json();
      }).then(function (task) {
        return _this5.replaceTask(task);
      })["catch"](function (_ref7) {
        var message = _ref7.message;
        return console.log(message);
      });
    }
  }, {
    key: "findDublicate",
    value: function findDublicate(value) {
      var newTask = this.tasks.find(function (task) {
        return task.value === value;
      });

      if (newTask === undefined) {
        return true;
      } else {
        return false;
      }

      ;
    }
  }, {
    key: "replaceTask",
    value: function replaceTask(task) {
      var index = this.tasks.findIndex(function (_ref8) {
        var _id = _ref8._id;
        return _id === task._id;
      });

      if (index !== -1) {
        this.tasks.splice(index, 1, task);
      }
    }
  }]);

  return List;
}();

var TodoInterface = /*#__PURE__*/function () {
  function TodoInterface(containerEl, todo, userMail, listName) {
    _classCallCheck(this, TodoInterface);

    this.form = this.fillForm();
    this.list = this.createList();
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

  _createClass(TodoInterface, [{
    key: "fillForm",
    value: function fillForm() {
      var _this6 = this;

      var form = document.querySelector('form');
      var input = document.querySelector('input');
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        _this6.todo.addTask(input.value, 1);

        _this6.processTasks();

        form.reset();
      });
      return form;
    }
  }, {
    key: "createList",
    value: function createList() {
      var ul = document.createElement('ul');
      return ul;
    }
  }, {
    key: "processTasks",
    value: function processTasks() {
      var _this7 = this;

      this.list.innerHTML = '';
      this.todo.tasks.forEach(function (task) {
        var $li = document.createElement('li');
        $li.innerHTML = "<span>".concat(task.value, "</span>\n            <button type = 'button'>Delete</button>\n            <button type = 'button' class = 'done-button'>Done</button>\n            ");
        $li.querySelector('button').addEventListener('click', function (e) {
          e.target.parentElement.remove();

          if ($li.querySelector('span').textContent === task.value) {
            _this7.todo.deleteTask(task._id);
          }
        });

        _this7.list.append($li);

        $li.querySelector('.done-button').addEventListener('click', function (e) {
          $li.classList.toggle('done');

          if ($li.querySelector('span').textContent === task.value) {
            _this7.todo.toggleCompletion(task._id);
          }
        });
        var hideButton = document.querySelector('.hide-button');
        hideButton.addEventListener('click', function (e) {
          if ($li.className === 'done') {
            $li.classList.add('hidden');
          } else {
            $li.classList.remove('hidden');
          }
        });
      });
      return this.list;
    }
  }]);

  return TodoInterface;
}();

var todo = new TodoInterface(document.querySelector('body'), new List('https://todo.hillel.it'), 'thoronion@gmail.com', 'My New Todolist');