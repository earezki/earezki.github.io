---
title: "How to Design a Fully Interactive, Reactive, and Dynamic Terminal-Based Data Dashboard Using Textual"
pubDate: 2025-11-15
description: "Build a terminal-based dashboard with Textual, featuring reactive widgets and real-time data updates in Python."
categories: ["AI News", "Big Data", "Tutorials"]
---

## How to Design a Fully Interactive, Reactive, and Dynamic Terminal-Based Data Dashboard Using Textual

This tutorial demonstrates building a terminal-based dashboard with Textual, a Python framework that rivals web UIs in reactivity. The app features live stats, dynamic tables, and keyboard shortcuts—all in a single Python script.

### Why This Matters
Traditional CLI tools are static and require manual refreshes, but Textual’s reactive model enables state-driven updates without polling. This reduces latency and complexity, making terminal UIs as expressive as web apps. Failure to leverage reactivity can lead to inconsistent user experiences, especially in data-heavy workflows.

### Key Insights
- "StatsCard widget updates automatically with reactive values": e.g., `self.value = reactive(0)` in the code.
- "Reactive state management in Textual enables live UI updates without manual refreshes": demonstrated via `watch_value` and `update_stats()`.
- "Textual used by developers for terminal-first dashboards": example includes `DataTable`, `Tree`, and `ProgressBar` widgets.

### Working Example
```python
from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, Vertical
from textual.widgets import Header, Footer, Button, DataTable, Static, Input, Label, ProgressBar, Tree, Select
from textual.reactive import reactive
from textual import on
import random

class StatsCard(Static):
    value = reactive(0)
    def __init__(self, title: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.title = title
    def compose(self) -> ComposeResult:
        yield Label(self.title)
        yield Label(str(self.value), id="stat-value")
    def watch_value(self, new_value: int) -> None:
        if self.is_mounted:
            self.query_one("#stat-value", Label).update(str(new_value))

class DataDashboard(App):
    CSS = """
    Screen { background: $surface; }
    #main-container { height: 100%; padding: 1; }
    #stats-row { height: auto; margin-bottom: 1; }
    StatsCard { border: solid $primary; height: 5; padding: 1; margin-right: 1; width: 1fr; }
    #stat-value { text-style: bold; color: $accent; content-align: center middle; }
    #control-panel { height: 12; border: solid $secondary; padding: 1; margin-bottom: 1; }
    #data-section { height: 1fr; }
    #left-panel { width: 30; border: solid $secondary; padding: 1; margin-right: 1; }
    DataTable { height: 100%; border: solid $primary; }
    Input { margin: 1 0; }
    Button { margin: 1 1 1 0; }
    ProgressBar { margin: 1 0; }
    """
    BINDINGS = [
        ("d", "toggle_dark", "Toggle Dark Mode"),
        ("q", "quit", "Quit"),
        ("a", "add_row", "Add Row"),
        ("c", "clear_table", "Clear Table"),
    ]
    total_rows = reactive(0)
    total_sales = reactive(0)
    avg_rating = reactive(0.0)

    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)
        with Container(id="main-container"):
            with Horizontal(id="stats-row"):
                yield StatsCard("Total Rows", id="card-rows")
                yield StatsCard("Total Sales", id="card-sales")
                yield StatsCard("Avg Rating", id="card-rating")
            with Vertical(id="control-panel"):
                yield Input(placeholder="Product Name", id="input-name")
                yield Select(
                    [("Electronics", "electronics"), ("Books", "books"), ("Clothing", "clothing")],
                    prompt="Select Category", id="select-category"
                )
                with Horizontal():
                    yield Button("Add Row", variant="primary", id="btn-add")
                    yield Button("Clear Table", variant="warning", id="btn-clear")
                    yield Button("Generate Data", variant="success", id="btn-generate")
                    yield ProgressBar(total=100, id="progress")
            with Horizontal(id="data-section"):
                with Container(id="left-panel"):
                    yield Label("Navigation")
                    tree = Tree("Dashboard")
                    tree.root.expand()
                    products = tree.root.add("Products", expand=True)
                    products.add_leaf("Electronics")
                    products.add_leaf("Books")
                    products.add_leaf("Clothing")
                    tree.root.add_leaf("Reports")
                    tree.root.add_leaf("Settings")
                    yield tree
                yield DataTable(id="data-table")
        yield Footer()

    def on_mount(self) -> None:
        table = self.query_one(DataTable)
        table.add_columns("ID", "Product", "Category", "Price", "Sales", "Rating")
        table.cursor_type = "row"
        self.generate_sample_data(5)
        self.set_interval(0.1, self.update_progress)

    def generate_sample_data(self, count: int = 5) -> None:
        table = self.query_one(DataTable)
        categories = ["Electronics", "Books", "Clothing"]
        products = {
            "Electronics": ["Laptop", "Phone", "Tablet", "Headphones"],
            "Books": ["Novel", "Textbook", "Magazine", "Comic"],
            "Clothing": ["Shirt", "Pants", "Jacket", "Shoes"]
        }
        for _ in range(count):
            category = random.choice(categories)
            product = random.choice(products[category])
            row_id = self.total_rows + 1
            price = round(random.uniform(10, 500), 2)
            sales = random.randint(1, 100)
            rating = round(random.uniform(1, 5), 1)
            table.add_row(
                str(row_id),
                product,
                category,
                f"${price}",
                str(sales),
                str(rating)
            )
            self.total_rows += 1
            self.total_sales += sales
            self.update_stats()

    def update_stats(self) -> None:
        self.query_one("#card-rows", StatsCard).value = self.total_rows
        self.query_one("#card-sales", StatsCard).value = self.total_sales
        if self.total_rows > 0:
            table = self.query_one(DataTable)
            total_rating = sum(float(row[5]) for row in table.rows)
            self.avg_rating = round(total_rating / self.total_rows, 2)
            self.query_one("#card-rating", StatsCard).value = self.avg_rating

    def update_progress(self) -> None:
        progress = self.query_one(ProgressBar)
        progress.advance(1)
        if progress.progress >= 100:
            progress.progress = 0

    @on(Button.Pressed, "#btn-add")
    def handle_add_button(self) -> None:
        name_input = self.query_one("#input-name", Input)
        category = self.query_one("#select-category", Select).value
        if name_input.value and category:
            table = self.query_one(DataTable)
            row_id = self.total_rows + 1
            price = round(random.uniform(10, 500), 2)
            sales = random.randint(1, 100)
            rating = round(random.uniform(1, 5), 1)
            table.add_row(
                str(row_id),
                name_input.value,
                str(category),
                f"${price}",
                str(sales),
                str(rating)
            )
            self.total_rows += 1
            self.total_sales += sales
            self.update_stats()
            name_input.value = ""

    @on(Button.Pressed, "#btn-clear")
    def handle_clear_button(self) -> None:
        table = self.query_one(DataTable)
        table.clear()
        self.total_rows = 0
        self.total_sales = 0
        self.avg_rating = 0
        self.update_stats()

    @on(Button.Pressed, "#btn-generate")
    def handle_generate_button(self) -> None:
        self.generate_sample_data(10)

    def action_toggle_dark(self) -> None:
        self.dark = not self.dark

    def action_add_row(self) -> None:
        self.handle_add_button()

    def action_clear_table(self) -> None:
        self.handle_clear_button()

if __name__ == "__main__":
    from nest_asyncio import apply
    apply()
    app = DataDashboard()
    app.run()
```

### Practical Applications
- **Use Case**: Data analysts using Textual for real-time terminal dashboards in Jupyter notebooks.
- **Pitfall**: Over-reliance on Textual's reactivity without proper state management can lead to UI inconsistencies.

**References:**
- https://www.marktechpost.com/2025/11/15/how-to-design-a-fully-interactive-reactive-and-dynamic-terminal-based-data-dashboard-using-textual/