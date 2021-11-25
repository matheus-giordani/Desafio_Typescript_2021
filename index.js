var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Entry point
document.addEventListener("DOMContentLoaded", function () {
    var listElement = document.getElementById("todoList");
    TodoApp(listElement);
});
var updateStateEvent = new CustomEvent("updateState", {});
// transformando class
var makeState1 = /** @class */ (function () {
    function makeState1(initialState) {
        this._state = initialState;
        this.uptadeEvent();
    }
    Object.defineProperty(makeState1.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (x) {
            this._state = x;
            this.uptadeEvent();
        },
        enumerable: false,
        configurable: true
    });
    makeState1.prototype.uptadeEvent = function () {
        document.dispatchEvent(updateStateEvent);
    };
    return makeState1;
}());
// Exemplo de generics
// function makeState<S>(initialState: S) {
//   let state: S;
//   function getState() {
//     return state;
//   }
//   function setState(x: S) {
//     state = x;
//     document.dispatchEvent(updateStateEvent);
//   }
//   setState(initialState);
//   return { getState, setState };
// }
// Application
function TodoApp(listElement) {
    var todoState = new makeState1([]);
    // const { getState, setState } = makeState<Todo[]>([]);
    var dataSet = new Set(["home", "work", "school"]);
    var nextId = 0;
    listElement.innerHTML = "\n    <ul></ul>\n    <span class=\"text-muted\">0 Done</span>\n    <a href=\"#\">Mark all done</a>\n    <form class=\"d-flex gap-1\">\n      <input class=\"form-control\" type=\"text\" name=\"text\" id=\"inputText\" placeholder=\"Text\" required />\n      \n      <input class=\"form-control\" list=\"tagOptions\" id=\"tagList\" placeholder=\"Tag\" />\n      <datalist id=\"tagOptions\">\n        ".concat(Array.from(dataSet)
        .map(function (el) { return "\n          <option value=\"".concat(el, "\">"); })
        .join("\n"), "\n      </datalist>\n\n      <button class=\"btn btn-outline-success\" type=\"submit\">Add</button>\n    </form>\n  ");
    var formElement = listElement.querySelector("form");
    var inputTextElement = listElement.querySelector("#inputText");
    var inputTagElement = listElement.querySelector("#tagList");
    var btnElement = listElement.querySelector("button");
    btnElement.addEventListener("click", function (ev) {
        ev.preventDefault();
        // Validação
        formElement.classList.add("was-validated");
        if (!formElement.checkValidity())
            return;
        todoState.state = (__spreadArray(__spreadArray([], todoState.state, true), [
            createTodo(inputTextElement.value, inputTagElement.value),
        ], false));
        // Resetar o form
        formElement.reset();
        formElement.classList.remove("was-validated");
    });
    var aElement = listElement.querySelector("a");
    aElement.addEventListener("click", function (ev) {
        ev.preventDefault();
        todoState.state = (completeAll(todoState.state));
    });
    function todoDivElement(todo) {
        var id = todo.id, text = todo.text, done = todo.done, tag = todo.tag;
        var todoDiv = document.createElement("div");
        todoDiv.classList.add("form-check");
        todoDiv.innerHTML = "\n    <input class=\"form-check-input\" type=\"checkbox\" id=\"".concat(id, "\">\n    <label class=\"form-check-label\" for=\"").concat(id, "\">\n      ").concat(text, "\n    </label>");
        if (tag) {
            var _a = createTodoTagTuple(tag), el1 = _a[0], el2 = _a[1];
            todoDiv.appendChild(el1);
            todoDiv.appendChild(el2);
        }
        var input = todoDiv.querySelector("input");
        if (done)
            input.setAttribute("checked", "");
        input.addEventListener("change", function (_) { return handleToggleTodo(todo); });
        return todoDiv;
    }
    function handleToggleTodo(todo) {
        var id = todo.id;
        var newTodo = toggleTodo(todo);
        var data = todoState.state.filter(function (el) { return el.id != id; });
        data.push(newTodo);
        data.sort(function (a, b) { return a.id - b.id; });
        todoState.state = data;
    }
    function toggleTodo(value) {
        return __assign(__assign({}, value), { done: !value.done });
    }
    function createTodo(text, rawTag) {
        if (rawTag === void 0) { rawTag = ""; }
        return {
            id: nextId++,
            text: text,
            done: false,
            tag: getTodoTag(rawTag)
        };
    }
    function getTodoTag(tag) {
        return tag === "home" || tag === "school" || tag === "work" ? tag : "pin";
    }
    function createTodoTagTuple(tag) {
        var label = document.createElement("span");
        var icon = document.createElement("i");
        icon.classList.add("mx-1");
        icon.classList.add("bi");
        if (tag === "home") {
            icon.classList.add("bi-house");
            label.textContent = "Home";
        }
        else if (tag === "work") {
            icon.classList.add("bi-briefcase");
            label.textContent = "Work";
        }
        else if (tag == "pin") {
            icon.classList.add("bi-pin");
            label.textContent = "pin";
        }
        else {
            icon.classList.add("bi-mortarboard");
            label.textContent = "school";
        }
        return [icon, label];
    }
    function completeAll(todos) {
        return todos.map(function (val) {
            return __assign(__assign({}, val), { done: true });
        });
    }
    function getTotalDone(todos) {
        return todos.reduce(function (acc, red) { return acc + Number(red.done); }, 0);
    }
    function render() {
        var todos = todoState.state;
        var total = getTotalDone(todos);
        var ulElement = listElement.querySelector("ul");
        ulElement.innerHTML = "";
        var spanElement = listElement.querySelector("span");
        spanElement.innerText = "".concat(total, " Done");
        var todoDivs = todos.map(todoDivElement);
        todoDivs.forEach(function (el) { return ulElement.appendChild(el); });
    }
    document.addEventListener("updateState", function (_) {
        render();
    });
    todoState.state = ([createTodo("First todo"), createTodo("Second todo")]);
}
