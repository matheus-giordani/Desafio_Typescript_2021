type BuiltInTag = "home" | "school" | "work";

type TodoTag = BuiltInTag | "pin";

type Todo = Readonly<{
  id: number;
  text: string;
  done: boolean;
  tag?: TodoTag;
}>;

// Entry point
document.addEventListener("DOMContentLoaded", () => {
  const listElement = document.getElementById("todoList") as HTMLDivElement;
  TodoApp(listElement);
});

const updateStateEvent = new CustomEvent("updateState", {});
// transformando class
class makeState1<S>{
  private _state: S;
  constructor(initialState: S) {
    this._state = initialState;
    this.uptadeEvent();
  }
  get state() {
    return this._state
  }
  set state(x: S) {
    this._state = x;
    this.uptadeEvent();
  }
  private uptadeEvent() {
    document.dispatchEvent(updateStateEvent);
  }
}
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
function TodoApp(listElement: HTMLDivElement) {
  const todoState = new makeState1<Todo[]>([])
  // const { getState, setState } = makeState<Todo[]>([]);
  const dataSet: Set<BuiltInTag> = new Set(["home", "work", "school"]);
  let nextId = 0;

  listElement.innerHTML = `
    <ul></ul>
    <span class="text-muted">0 Done</span>
    <a href="#">Mark all done</a>
    <form class="d-flex gap-1">
      <input class="form-control" type="text" name="text" id="inputText" placeholder="Text" required />
      
      <input class="form-control" list="tagOptions" id="tagList" placeholder="Tag" />
      <datalist id="tagOptions">
        ${Array.from(dataSet)
      .map(
        (el) => `
          <option value="${el}">`
      )
      .join("\n")}
      </datalist>

      <button class="btn btn-outline-success" type="submit">Add</button>
    </form>
  `;

  const formElement = listElement.querySelector("form")!;
  const inputTextElement = listElement.querySelector(
    "#inputText"
  )! as HTMLInputElement;
  const inputTagElement = listElement.querySelector(
    "#tagList"
  )! as HTMLInputElement;

  const btnElement = listElement.querySelector("button")!;
  btnElement.addEventListener("click", (ev) => {
    ev.preventDefault();
    // Validação
    formElement.classList.add("was-validated");
    if (!formElement.checkValidity()) return;

    todoState.state = ([
      ...todoState.state,
      createTodo(inputTextElement.value, inputTagElement.value),
    ]);

    // Resetar o form
    formElement.reset();
    formElement.classList.remove("was-validated");
  });

  const aElement = listElement.querySelector("a")!;
  aElement.addEventListener("click", (ev) => {
    ev.preventDefault();
    todoState.state = (completeAll(todoState.state));
  });

  function todoDivElement(todo: Todo): HTMLDivElement {
    const { id, text, done, tag } = todo;

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("form-check");
    todoDiv.innerHTML = `
    <input class="form-check-input" type="checkbox" id="${id}">
    <label class="form-check-label" for="${id}">
      ${text}
    </label>`;

    if (tag) {
      const [el1, el2] = createTodoTagTuple(tag);
      todoDiv.appendChild(el1);
      todoDiv.appendChild(el2);
    }

    const input = todoDiv.querySelector<HTMLInputElement>("input")!;
    if (done) input.setAttribute("checked", "");
    input.addEventListener("change", (_) => handleToggleTodo(todo));

    return todoDiv;
  }

  function handleToggleTodo(todo: Todo) {
    const id = todo.id;
    const newTodo = toggleTodo(todo);

    const data = todoState.state.filter((el) => el.id != id);

    data.push(newTodo);

    data.sort((a, b) => a.id - b.id);

    todoState.state = data;
  }

  function toggleTodo(value: Todo): Todo {
    return {
      ...value,
      done: !value.done,

    }

  }

  function createTodo(text: string, rawTag: string = ""): Todo {
    return {
      id: nextId++,
      text,
      done: false,
      tag: getTodoTag(rawTag),
    };
  }

  function getTodoTag(tag: string): TodoTag {
    return tag === "home" || tag === "school" || tag === "work" ? tag : "pin";
  }

  function createTodoTagTuple(tag: TodoTag): [HTMLElement, HTMLSpanElement] {
    const label = document.createElement("span");
    const icon = document.createElement("i");
    icon.classList.add("mx-1");
    icon.classList.add("bi");

    if (tag === "home") {
      icon.classList.add("bi-house");
      label.textContent = "Home";
    } else if (tag === "work") {
      icon.classList.add("bi-briefcase");
      label.textContent = "Work";
    } else if (tag == "pin") {
      icon.classList.add("bi-pin");
      label.textContent = "pin";
    } else {
      icon.classList.add("bi-mortarboard");
      label.textContent = "school";
    }

    return [icon, label];
  }
  interface completed extends Todo {
    done: true
  }

  function completeAll(todos: Todo[]): Array<completed> {
    return todos.map((val) => {
      return {
        ...val,
        done: true
      }
    }

    )

  }

  function getTotalDone(todos: Todo[]): number {
    return todos.reduce((acc, red) => acc + Number(red.done), 0);

  }

  function render() {
    const todos = todoState.state;
    const total = getTotalDone(todos);

    const ulElement = listElement.querySelector("ul")!;
    ulElement.innerHTML = "";

    const spanElement = listElement.querySelector("span")!;
    spanElement.innerText = `${total} Done`;

    const todoDivs = todos.map(todoDivElement);
    todoDivs.forEach((el) => ulElement.appendChild(el));
  }

  document.addEventListener("updateState", (_) => {
    render();
  });

  todoState.state = ([createTodo("First todo"), createTodo("Second todo")]);
}
